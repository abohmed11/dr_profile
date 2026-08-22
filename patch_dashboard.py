import re

with open('src/components/Dashboard.tsx', 'r') as f:
    content = f.read()

# Add landingConfig to DashboardProps
props_target = r"""interface DashboardProps \{
  doctor: Doctor;
  loggedSecretary\?: Secretary \| null;
  userRole\?: 'admin' \| 'doctor' \| 'secretary' \| null;
  appointments: Appointment\[\];
  banners\?: DoctorBanner\[\];"""

props_replacement = """interface DashboardProps {
  doctor: Doctor;
  loggedSecretary?: Secretary | null;
  userRole?: 'admin' | 'doctor' | 'secretary' | null;
  appointments: Appointment[];
  banners?: DoctorBanner[];
  landingConfig?: any;"""

content = re.sub(props_target, props_replacement, content)

# Add landingConfig to the component signature
sig_target = r"""export default function Dashboard\(\{ 
  doctor, 
  loggedSecretary,
  userRole,
  appointments, 
  banners,
  onUpdateDoctor, 
  onUpdateAppointments, 
  onLogout, 
  onPreviewPublicSite 
\}: DashboardProps\) \{"""

sig_replacement = """export default function Dashboard({ 
  doctor, 
  loggedSecretary,
  userRole,
  appointments, 
  banners,
  landingConfig,
  onUpdateDoctor, 
  onUpdateAppointments, 
  onLogout, 
  onPreviewPublicSite 
}: DashboardProps) {"""

content = re.sub(sig_target, sig_replacement, content)

with open('src/components/Dashboard.tsx', 'w') as f:
    f.write(content)
