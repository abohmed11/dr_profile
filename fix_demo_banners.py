import re

with open('src/App.tsx', 'r') as f:
    content = f.read()

pattern = r"""  useEffect\(\(\) => \{
    const unsubDoctors = subscribeDoctors"""

replacement = """  useEffect(() => {
    // Delete demo banners if they exist
    if (doctorBanners.some(b => b.id === 'banner-1' || b.id === 'banner-2')) {
      const remainingBanners = doctorBanners.filter(b => b.id !== 'banner-1' && b.id !== 'banner-2');
      handleUpdateBanners(remainingBanners);
    }
  }, [doctorBanners]);

  useEffect(() => {
    const unsubDoctors = subscribeDoctors"""

content = content.replace(pattern, replacement)

with open('src/App.tsx', 'w') as f:
    f.write(content)

