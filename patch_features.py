import os

def replace_in_file(filepath, old_str, new_str):
    if not os.path.exists(filepath):
        print(f"File {filepath} not found.")
        return
    
    with open(filepath, "r", encoding="utf-8") as f:
        text = f.read()
    
    if old_str in text:
        text = text.replace(old_str, new_str)
        with open(filepath, "w", encoding="utf-8") as f:
            f.write(text)
        print(f"Updated {filepath}")
    else:
        print(f"'{old_str}' not found in {filepath}")

replace_in_file(
    "src/components/Features.tsx",
    "{ ar: 'تصميم احترافي', en: 'Professional design', icon: Sparkles }",
    "{ ar: 'قوالب متعددة وتصميم احترافي', en: 'Multiple templates and professional design', icon: Sparkles }"
)

replace_in_file(
    "src/types.ts",
    "'تصميم احترافي'",
    "'قوالب متعددة وتصميم احترافي'"
)

