import re

with open('src/App.tsx', 'r') as f:
    content = f.read()

pattern = r"""                    onUpdateAppointments=\{\(updatedApts\) => \{
                      setAppointments\(updatedApts\);
                      updatedApts\.forEach\(apt => \{
                        saveAppointmentInDb\(apt\);
                        saveAppointmentToSupabase\(apt\);
                      \}\);
                    \}\}"""

replacement = """                    onUpdateAppointments={(updatedApts) => {
                      const oldMap = new Map(appointments.map(a => [a.id, a]));
                      setAppointments(updatedApts);
                      updatedApts.forEach(apt => {
                        const oldApt = oldMap.get(apt.id);
                        if (!oldApt || JSON.stringify(oldApt) !== JSON.stringify(apt)) {
                          saveAppointmentInDb(apt);
                          saveAppointmentToSupabase(apt);
                        }
                      });
                    }}"""

content = re.sub(pattern, replacement, content)

with open('src/App.tsx', 'w') as f:
    f.write(content)

