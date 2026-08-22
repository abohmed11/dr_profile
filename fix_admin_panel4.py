import re

with open('src/components/AdminPanel.tsx', 'r') as f:
    content = f.read()

pattern2 = r"\{\/\* Field 8: Options.*?\{\/\* Actions \*\/\}"

replacement2 = r"""{/* Field 8: Options */}
              <div className="pt-2">
                <label className="flex items-center gap-2 p-3 bg-neutral-50 border border-neutral-200 rounded-xl text-xs font-extrabold cursor-pointer w-full sm:w-fit">
                  <input
                    type="checkbox"
                    checked={bannerIsActive}
                    onChange={(e) => setBannerIsActive(e.target.checked)}
                    className="w-4 h-4 text-emerald-600 rounded"
                  />
                  <span>🟢 الإشعار مفعل ومتاح للإرسال</span>
                </label>
              </div>

              {/* Actions */}"""

content = re.sub(pattern2, replacement2, content, flags=re.DOTALL)

with open('src/components/AdminPanel.tsx', 'w') as f:
    f.write(content)

