import re

with open('src/lib/supabase.ts', 'r') as f:
    content = f.read()

# 1. Update saveBannersToSupabase
save_pattern = r"const row = \{\n\s*id: banner\.id,\n\s*title: banner\.title,\n\s*description: banner\.description \|\| '',\n\s*color: banner\.color \|\| 'blue',\n\s*is_active: banner\.isActive \?\? true,\n\s*priority: banner\.priority \|\| 1,\n\s*\};"

save_replacement = """const extra = {
        targetAudience: banner.targetAudience,
        targetSpecialty: banner.targetSpecialty,
        targetDoctorIds: banner.targetDoctorIds,
        startDate: banner.startDate,
        endDate: banner.endDate,
        icon: banner.icon,
        imageUrl: banner.imageUrl,
        buttonText: banner.buttonText,
        buttonUrl: banner.buttonUrl,
        isPinned: banner.isPinned,
        sentDate: banner.sentDate
      };
      const row = {
        id: banner.id,
        title: banner.title,
        description: (banner.description || '') + '|||JSON|||' + JSON.stringify(extra),
        color: banner.color || 'blue',
        is_active: banner.isActive ?? true,
        priority: banner.priority || 1,
      };"""

content = re.sub(save_pattern, save_replacement, content)

# 2. Update fetchBannersFromSupabase
fetch_pattern = r"return data\.map\(\(row: any\) => \(\{\n\s*id: row\.id,\n\s*title: row\.title,\n\s*description: row\.description \|\| '',\n\s*color: row\.color \|\| 'blue',\n\s*isActive: row\.is_active \?\? true,\n\s*priority: row\.priority \|\| 1\n\s*\}\)\) as DoctorBanner\[\];"

fetch_replacement = """return data.map((row: any) => {
      let desc = row.description || '';
      let extra: any = {};
      if (desc.includes('|||JSON|||')) {
        const parts = desc.split('|||JSON|||');
        desc = parts[0];
        try { extra = JSON.parse(parts[1]); } catch(e){}
      }
      return {
        id: row.id,
        title: row.title,
        description: desc,
        color: row.color || 'blue',
        isActive: row.is_active ?? true,
        priority: row.priority || 1,
        targetAudience: extra.targetAudience || 'all',
        targetSpecialty: extra.targetSpecialty,
        targetDoctorIds: extra.targetDoctorIds,
        startDate: extra.startDate,
        endDate: extra.endDate,
        icon: extra.icon,
        imageUrl: extra.imageUrl,
        buttonText: extra.buttonText,
        buttonUrl: extra.buttonUrl,
        isPinned: extra.isPinned,
        sentDate: extra.sentDate
      };
    }) as DoctorBanner[];"""

content = re.sub(fetch_pattern, fetch_replacement, content)

with open('src/lib/supabase.ts', 'w') as f:
    f.write(content)

