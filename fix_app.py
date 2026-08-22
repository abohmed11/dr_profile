import re

with open('src/App.tsx', 'r') as f:
    content = f.read()

pattern1 = r"""  const handleUpdateDoctors = \(updatedDocs: Doctor\[\]\) => \{
    // Delete doctors that were removed
    const newIds = new Set\(updatedDocs\.map\(d => d\.id\)\);
    doctors\.forEach\(d => \{
      if \(!newIds\.has\(d\.id\)\) \{
        deleteDoctorFromDb\(d\.id\);
        deleteDoctorFromSupabase\(d\.id\);
      \}
    \}\);

    setDoctors\(updatedDocs\);
    updatedDocs\.forEach\(d => \{
      saveDoctorInDb\(d\);
      saveDoctorToSupabase\(d\);
    \}\);
    try \{
      localStorage\.setItem\('dr_doctors', JSON\.stringify\(updatedDocs\)\);
    \} catch \(e\) \{
      console\.error\("Failed to save doctors", e\);
    \}
  \};"""

replacement1 = """  const handleUpdateDoctors = (updatedDocs: Doctor[]) => {
    // Delete doctors that were removed
    const newIds = new Set(updatedDocs.map(d => d.id));
    doctors.forEach(d => {
      if (!newIds.has(d.id)) {
        deleteDoctorFromDb(d.id);
        deleteDoctorFromSupabase(d.id);
      }
    });

    const oldDoctorsMap = new Map(doctors.map(d => [d.id, d]));
    
    setDoctors(updatedDocs);
    updatedDocs.forEach(d => {
      const oldDoc = oldDoctorsMap.get(d.id);
      if (!oldDoc || JSON.stringify(oldDoc) !== JSON.stringify(d)) {
        saveDoctorInDb(d);
        saveDoctorToSupabase(d);
      }
    });
    try {
      localStorage.setItem('dr_doctors', JSON.stringify(updatedDocs));
    } catch (e) {
      console.error("Failed to save doctors", e);
    }
  };"""

pattern2 = r"""  const handleUpdateSpecialties = \(newSpecs: SystemSpecialty\[\]\) => \{
    setSpecialties\(newSpecs\);
    saveSpecialtiesInDb\(newSpecs\);
    try \{
      localStorage\.setItem\('dr_specialties', JSON\.stringify\(newSpecs\)\);
    \} catch \(e\) \{
      console\.error\("Failed to save specialties", e\);
    \}
  \};"""

replacement2 = """  const handleUpdateSpecialties = (newSpecs: SystemSpecialty[]) => {
    setSpecialties(newSpecs);
    // Only save changed
    const oldSpecsMap = new Map(specialties.map(s => [s.id, s]));
    newSpecs.forEach(s => {
       const oldS = oldSpecsMap.get(s.id);
       if (!oldS || JSON.stringify(oldS) !== JSON.stringify(s)) {
          // It's technically saveSpecialtiesInDb which takes an array... wait.
          // In firebase.ts, saveSpecialtiesInDb loops over array and saves each.
          // So passing a filtered array is better.
       }
    });
    // Actually, I'll just filter it
    const changedSpecs = newSpecs.filter(s => {
       const oldS = oldSpecsMap.get(s.id);
       return !oldS || JSON.stringify(oldS) !== JSON.stringify(s);
    });
    if (changedSpecs.length > 0) {
      saveSpecialtiesInDb(changedSpecs);
    }
    
    try {
      localStorage.setItem('dr_specialties', JSON.stringify(newSpecs));
    } catch (e) {
      console.error("Failed to save specialties", e);
    }
  };"""

pattern3 = r"""  const handleUpdateBanners = \(newBanners: DoctorBanner\[\]\) => \{
    // Permanently remove any banner that was deleted
    const newIds = new Set\(newBanners\.map\(b => b\.id\)\);
    doctorBanners\.forEach\(b => \{
      if \(!newIds\.has\(b\.id\)\) \{
        deleteBannerFromDb\(b\.id\);
        deleteBannerFromSupabase\(b\.id\);
      \}
    \}\);

    setDoctorBanners\(newBanners\);
    saveBannersInDb\(newBanners\);
    saveBannersToSupabase\(newBanners\);
    try \{
      localStorage\.setItem\('dr_banners', JSON\.stringify\(newBanners\)\);
    \} catch \(e\) \{
      console\.error\("Failed to save banners", e\);
    \}
  \};"""

replacement3 = """  const handleUpdateBanners = (newBanners: DoctorBanner[]) => {
    // Permanently remove any banner that was deleted
    const newIds = new Set(newBanners.map(b => b.id));
    doctorBanners.forEach(b => {
      if (!newIds.has(b.id)) {
        deleteBannerFromDb(b.id);
        deleteBannerFromSupabase(b.id);
      }
    });

    setDoctorBanners(newBanners);
    
    const oldBannersMap = new Map(doctorBanners.map(b => [b.id, b]));
    const changedBanners = newBanners.filter(b => {
      const oldB = oldBannersMap.get(b.id);
      return !oldB || JSON.stringify(oldB) !== JSON.stringify(b);
    });
    
    if (changedBanners.length > 0) {
      saveBannersInDb(changedBanners);
      saveBannersToSupabase(changedBanners);
    }
    
    try {
      localStorage.setItem('dr_banners', JSON.stringify(newBanners));
    } catch (e) {
      console.error("Failed to save banners", e);
    }
  };"""


content = re.sub(pattern1, replacement1, content)
content = re.sub(pattern2, replacement2, content)
content = re.sub(pattern3, replacement3, content)

with open('src/App.tsx', 'w') as f:
    f.write(content)

