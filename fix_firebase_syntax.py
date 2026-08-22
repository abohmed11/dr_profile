import re

with open('src/lib/firebase.ts', 'r') as f:
    content = f.read()

# Fix import error
content = content.replace("  deleteDoc,\n  disableNetworktorFromSupabase,", "  deleteDoctorFromSupabase,")

# Fix method call
content = content.replace("  deleteDoc,\n  disableNetworktorFromSupabase(doctorId)", "  deleteDoctorFromSupabase(doctorId)")

with open('src/lib/firebase.ts', 'w') as f:
    f.write(content)

