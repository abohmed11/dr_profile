import re

with open('src/components/AdminPanel.tsx', 'r') as f:
    content = f.read()

# Remove Color Theme, Image Input, Start/End Date, Priority, and Pinned

# We will just rewrite the entire form section to be clean and simple.
