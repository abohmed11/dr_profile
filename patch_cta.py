import re

# 1. Update src/App.tsx
with open("src/App.tsx", "r", encoding="utf-8") as f:
    text = f.read()

text = text.replace(
    "mergedCreateSite.headerCtaButtonText === 'أنشئ الآن'",
    "mergedCreateSite.headerCtaButtonText === 'أنشئ الآن' || mergedCreateSite.headerCtaButtonText === 'اشترك الآن'"
)
text = text.replace(
    "mergedCreateSite.heroCtaButtonText === 'أنشئ الآن'",
    "mergedCreateSite.heroCtaButtonText === 'أنشئ الآن' || mergedCreateSite.heroCtaButtonText === 'اشترك الآن'"
)
text = text.replace(
    "mergedCreateSite.submitButtonText === 'أنشئ الآن'",
    "mergedCreateSite.submitButtonText === 'أنشئ الآن' || mergedCreateSite.submitButtonText === 'اشترك الآن'"
)
text = text.replace(
    "mergedHero.primaryCtaText === 'أنشئ الآن'",
    "mergedHero.primaryCtaText === 'أنشئ الآن' || mergedHero.primaryCtaText === 'اشترك الآن'"
)
if "mergedPricing.ctaText === 'اشترك الآن'" not in text:
    # Add check for mergedPricing.ctaText
    pricing_block = """        if (mergedPricing.subtitle === "اختر الباقة المناسبة لتفعيل بروفايلك الطبي") {
          mergedPricing.subtitle = "ادفع مرة واحدة واحصل على بروفايلك الطبي لمدة عام كامل";
        }"""
    pricing_block_new = """        if (mergedPricing.subtitle === "اختر الباقة المناسبة لتفعيل بروفايلك الطبي") {
          mergedPricing.subtitle = "ادفع مرة واحدة واحصل على بروفايلك الطبي لمدة عام كامل";
        }
        if (mergedPricing.ctaText === 'اشترك الآن') {
          mergedPricing.ctaText = 'ابدأ الآن مجاناً';
        }"""
    text = text.replace(pricing_block, pricing_block_new)

with open("src/App.tsx", "w", encoding="utf-8") as f:
    f.write(text)

# 2. Update src/components/Header.tsx
with open("src/components/Header.tsx", "r", encoding="utf-8") as f:
    text = f.read()

text = text.replace(
    "landingConfig.createSite.headerCtaButtonText !== 'أنشئ الآن'",
    "landingConfig.createSite.headerCtaButtonText !== 'أنشئ الآن' && landingConfig.createSite.headerCtaButtonText !== 'اشترك الآن'"
)
with open("src/components/Header.tsx", "w", encoding="utf-8") as f:
    f.write(text)

# 3. Update src/components/Login.tsx
with open("src/components/Login.tsx", "r", encoding="utf-8") as f:
    text = f.read()

text = text.replace("'اشترك الان'", "'ابدأ الآن مجاناً'")
with open("src/components/Login.tsx", "w", encoding="utf-8") as f:
    f.write(text)

# 4. Update src/components/Subscription.tsx
with open("src/components/Subscription.tsx", "r", encoding="utf-8") as f:
    text = f.read()

text = text.replace(
    "landingConfig?.pricing?.ctaText || \"ابدأ الآن مجاناً\"",
    "(landingConfig?.pricing?.ctaText === 'اشترك الآن' ? 'ابدأ الآن مجاناً' : landingConfig?.pricing?.ctaText) || 'ابدأ الآن مجاناً'"
)
with open("src/components/Subscription.tsx", "w", encoding="utf-8") as f:
    f.write(text)

