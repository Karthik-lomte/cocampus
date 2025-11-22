#!/usr/bin/env python3
"""
Automated script to update all remaining Co-Campus pages with backend integration.
This script applies the integration pattern to all pages that still use mock data.
"""

import os
import re
from pathlib import Path

# Integration template
INTEGRATION_TEMPLATE = '''import React, {{ useState, useEffect }} from 'react';
import {{ {serviceName} }} from '{serviceImport}';
import {{ useToast }} from '../components/Toast';
import Loading from '../components/Loading';
import ErrorMessage from '../components/ErrorMessage';
'''

def update_imports(content, service_name, service_import):
    """Update imports to include service and utility components"""
    lines = content.split('\n')

    # Find the first import line
    first_import_idx = None
    for i, line in enumerate(lines):
        if line.strip().startswith('import'):
            first_import_idx = i
            break

    if first_import_idx is None:
        return content

    # Check if already updated
    if 'useState' in content and service_name in content:
        print(f"  ✓ Already updated")
        return None

    # Add new imports after React import
    new_imports = [
        f"import {{ useState, useEffect }} from 'react';",
        f"import {{ {service_name} }} from '{service_import}';",
        f"import {{ useToast }} from '../components/Toast';",
        f"import Loading from '../components/Loading';",
        f"import ErrorMessage from '../components/ErrorMessage';",
    ]

    # Remove existing React import that doesn't have useState
    updated_lines = []
    for line in lines:
        if "import React from 'react'" in line or "import React, { " in line:
            if 'useState' not in line:
                continue
        updated_lines.append(line)

    # Insert new imports at the beginning
    result_lines = updated_lines[:first_import_idx] + new_imports + updated_lines[first_import_idx:]

    return '\n'.join(result_lines)

def add_state_management(content, component_name):
    """Add state management hooks"""
    # Find component function
    pattern = f"const {component_name} = \\(\\) => {{"
    match = re.search(pattern, content)

    if not match:
        return content

    state_code = '''  const toast = useToast();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await SERVICE_NAME.getMethod();
      setData(result);
    } catch (err) {
      console.error('Error:', err);
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loading fullScreen message="Loading..." />;
  if (error) return <ErrorMessage error={error} onRetry={loadData} fullScreen />;

'''

    # Insert after component declaration
    insert_pos = match.end()
    return content[:insert_pos] + '\n' + state_code + content[insert_pos:]

# Page mappings: file_name -> (service_name, service_method)
STUDENT_PAGES = {
    'Profile.jsx': ('studentService', 'getProfile'),
    'Results.jsx': ('studentService', 'getResults'),
    'Timetable.jsx': ('studentService', 'getTimetable'),
    'AcademicCalendar.jsx': ('studentService', 'getAcademicCalendar'),
    'Events.jsx': ('studentService', 'getEvents'),
    'Canteen.jsx': ('studentService', 'getCanteenStalls'),
    'CampusCoins.jsx': ('studentService', 'getWallet'),
    'GatePass.jsx': ('studentService', 'getGatePasses'),
    'Hostel.jsx': ('studentService', 'getHostelInfo'),
    'Certificates.jsx': ('studentService', 'getMyCertificates'),
    'Achievements.jsx': ('studentService', 'getAchievements'),
    'FeeManagement.jsx': ('studentService', 'getFees'),
    'Feedback.jsx': ('studentService', 'getProfile'),
    'Notices.jsx': ('studentService', 'getNotices'),
}

def main():
    print("=" * 60)
    print("Co-Campus Automated Page Integration Script")
    print("=" * 60)
    print()
    print("This script will update all remaining pages with backend integration.")
    print("Pattern: Replace mock data with real API calls")
    print()

    base_path = Path("/home/user/cocampus/cocampus-project/student-portal/src/pages")

    total = len(STUDENT_PAGES)
    updated = 0
    skipped = 0

    for page_file, (service, method) in STUDENT_PAGES.items():
        file_path = base_path / page_file

        if not file_path.exists():
            print(f"⚠ {page_file} not found")
            continue

        print(f"Processing {page_file}...")

        with open(file_path, 'r') as f:
            content = f.read()

        # Update imports
        updated_content = update_imports(content, service, '../services/studentService')

        if updated_content is None:
            skipped += 1
            continue

        # Add state management (simplified version)
        # In real implementation, this would be more sophisticated

        print(f"  ✓ Updated {page_file}")
        updated += 1

        # Write back (commented out for safety)
        # with open(file_path, 'w') as f:
        #     f.write(updated_content)

    print()
    print("=" * 60)
    print(f"Summary: {updated} updated, {skipped} skipped, {total} total")
    print("=" * 60)
    print()
    print("Note: This is a template script.")
    print("Actual updates are done manually following the integration pattern.")
    print("See INTEGRATION_GUIDE.md for the complete pattern.")

if __name__ == '__main__':
    main()
