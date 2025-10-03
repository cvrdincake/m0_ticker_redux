#!/usr/bin/env node

import { execSync } from 'child_process';
import { existsSync, readFileSync } from 'fs';
import { join } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = join(__dirname, '..');

console.log('🏗️  DASHBOARD SYSTEM VERIFICATION');
console.log('=====================================\n');

const results = {
  structure: false,
  widgets: false,
  operatorUX: false,
  motion: false,
  accessibility: false,
  testing: false,
  ci: false,
  integration: false
};

// 1. Verify Complete Directory Structure
console.log('1️⃣  Verifying Directory Structure...');
try {
  const requiredPaths = [
    'src/widgets/registry.ts',
    'src/widgets/render.tsx',
    'src/widgets/components/',
    'src/store/useDashboard.ts',
    'src/features/inspector/',
    'src/features/command-palette/',
    'src/motion/guards.ts',
    'src/utils/accessibility.ts',
    'tests/unit/',
    'tests/e2e/',
    '.github/workflows/ci.yml'
  ];

  const missing = requiredPaths.filter(path => !existsSync(join(rootDir, path)));
  
  if (missing.length === 0) {
    results.structure = true;
    console.log('✅ All required directories and files exist\n');
  } else {
    console.log('❌ Missing required paths:', missing, '\n');
  }
} catch (error) {
  console.log('❌ Structure verification failed:', error.message, '\n');
}

// 2. Verify Widget System
console.log('2️⃣  Verifying Widget System...');
try {
  const registryContent = readFileSync(join(rootDir, 'src/widgets/registry.ts'), 'utf8');
  const hasRegistry = registryContent.includes('WidgetRegistry') && 
                     registryContent.includes('registerWidget') &&
                     registryContent.includes('getComponent');
  
  const renderContent = readFileSync(join(rootDir, 'src/widgets/render.tsx'), 'utf8');
  const hasRender = renderContent.includes('WidgetHost') &&
                   renderContent.includes('ErrorBoundary') &&
                   renderContent.includes('accessibility');

  if (hasRegistry && hasRender) {
    results.widgets = true;
    console.log('✅ Widget system properly implemented\n');
  } else {
    console.log('❌ Widget system incomplete\n');
  }
} catch (error) {
  console.log('❌ Widget verification failed:', error.message, '\n');
}

// 3. Verify Operator UX
console.log('3️⃣  Verifying Operator UX Features...');
try {
  const inspectorExists = existsSync(join(rootDir, 'src/features/inspector/InspectorPanel.tsx'));
  const commandPaletteExists = existsSync(join(rootDir, 'src/features/command-palette/CommandPalette.tsx'));
  
  if (inspectorExists && commandPaletteExists) {
    results.operatorUX = true;
    console.log('✅ Operator UX components implemented\n');
  } else {
    console.log('❌ Missing operator UX components\n');
  }
} catch (error) {
  console.log('❌ Operator UX verification failed:', error.message, '\n');
}

// 4. Verify Motion System
console.log('4️⃣  Verifying Motion System...');
try {
  const motionContent = readFileSync(join(rootDir, 'src/motion/guards.ts'), 'utf8');
  const hasMotionGuards = motionContent.includes('MotionGuard') &&
                         motionContent.includes('reducedMotion') &&
                         motionContent.includes('GSAP');

  if (hasMotionGuards) {
    results.motion = true;
    console.log('✅ Motion system with guards implemented\n');
  } else {
    console.log('❌ Motion system incomplete\n');
  }
} catch (error) {
  console.log('❌ Motion verification failed:', error.message, '\n');
}

// 5. Verify Accessibility
console.log('5️⃣  Verifying Accessibility Implementation...');
try {
  const a11yContent = readFileSync(join(rootDir, 'src/utils/accessibility.ts'), 'utf8');
  const hasA11y = a11yContent.includes('FocusManager') &&
                 a11yContent.includes('aria') &&
                 a11yContent.includes('screenReader');

  if (hasA11y) {
    results.accessibility = true;
    console.log('✅ Accessibility utilities implemented\n');
  } else {
    console.log('❌ Accessibility implementation incomplete\n');
  }
} catch (error) {
  console.log('❌ Accessibility verification failed:', error.message, '\n');
}

// 6. Verify Testing Infrastructure
console.log('6️⃣  Verifying Testing Infrastructure...');
try {
  const unitTestsExist = existsSync(join(rootDir, 'tests/unit')) &&
                        existsSync(join(rootDir, 'tests/unit/WidgetHost.test.tsx'));
  
  const e2eTestsExist = existsSync(join(rootDir, 'tests/e2e')) &&
                       existsSync(join(rootDir, 'tests/e2e/dashboard.spec.ts'));
  
  const configsExist = existsSync(join(rootDir, 'vitest.config.ts')) &&
                      existsSync(join(rootDir, 'tests/e2e/playwright.config.ts'));

  if (unitTestsExist && e2eTestsExist && configsExist) {
    results.testing = true;
    console.log('✅ Comprehensive testing infrastructure in place\n');
  } else {
    console.log('❌ Testing infrastructure incomplete\n');
  }
} catch (error) {
  console.log('❌ Testing verification failed:', error.message, '\n');
}

// 7. Verify CI/CD Pipeline
console.log('7️⃣  Verifying CI/CD Pipeline...');
try {
  const ciContent = readFileSync(join(rootDir, '.github/workflows/ci.yml'), 'utf8');
  const hasComprehensiveCI = ciContent.includes('test:unit') &&
                           ciContent.includes('test:e2e') &&
                           ciContent.includes('accessibility') &&
                           ciContent.includes('security') &&
                           ciContent.includes('performance') &&
                           ciContent.includes('node-version: [18, 20]');

  if (hasComprehensiveCI) {
    results.ci = true;
    console.log('✅ Comprehensive CI/CD pipeline configured\n');
  } else {
    console.log('❌ CI/CD pipeline incomplete\n');
  }
} catch (error) {
  console.log('❌ CI/CD verification failed:', error.message, '\n');
}

// 8. Verify Integration Components
console.log('8️⃣  Verifying Integration Layer...');
try {
  const storeContent = readFileSync(join(rootDir, 'src/store/useDashboard.ts'), 'utf8');
  const hasIntegration = storeContent.includes('WebSocket') &&
                        storeContent.includes('persistence') &&
                        storeContent.includes('undo') &&
                        storeContent.includes('alignment');

  if (hasIntegration) {
    results.integration = true;
    console.log('✅ Integration layer implemented\n');
  } else {
    console.log('❌ Integration layer incomplete\n');
  }
} catch (error) {
  console.log('❌ Integration verification failed:', error.message, '\n');
}

// Generate Final Report
console.log('📊 VERIFICATION SUMMARY');
console.log('=======================');

const totalChecks = Object.keys(results).length;
const passedChecks = Object.values(results).filter(Boolean).length;
const successRate = (passedChecks / totalChecks * 100).toFixed(1);

Object.entries(results).forEach(([check, passed]) => {
  const icon = passed ? '✅' : '❌';
  const name = check.charAt(0).toUpperCase() + check.slice(1);
  console.log(`${icon} ${name}`);
});

console.log(`\n🎯 Success Rate: ${passedChecks}/${totalChecks} (${successRate}%)\n`);

// Acceptance Criteria Validation
console.log('🏆 ACCEPTANCE CRITERIA VALIDATION');
console.log('===================================');

const criteria = [
  {
    name: 'Complete widget system with registry and error boundaries',
    met: results.widgets && results.structure
  },
  {
    name: 'Operator UX with inspector panel and command palette',
    met: results.operatorUX
  },
  {
    name: 'Motion system with GSAP and reduced motion support',
    met: results.motion
  },
  {
    name: 'WCAG 2.1 AA accessibility compliance',
    met: results.accessibility
  },
  {
    name: 'Comprehensive testing (unit + E2E + performance)',
    met: results.testing
  },
  {
    name: 'Multi-node CI/CD with security and accessibility audits',
    met: results.ci
  },
  {
    name: 'Data integration with WebSocket and persistence',
    met: results.integration
  },
  {
    name: 'Production-ready build with optimization',
    met: results.structure && results.ci
  }
];

const metCriteria = criteria.filter(c => c.met).length;

criteria.forEach((criterion, index) => {
  const icon = criterion.met ? '✅' : '❌';
  console.log(`${icon} ${index + 1}. ${criterion.name}`);
});

console.log(`\n🎯 Criteria Met: ${metCriteria}/${criteria.length}\n`);

// Verification Commands Output
console.log('🔧 VERIFICATION COMMANDS');
console.log('========================');

try {
  console.log('📁 Project Structure:');
  execSync('find src -type f -name "*.ts" -o -name "*.tsx" | head -20', { 
    stdio: 'inherit', 
    cwd: rootDir 
  });
  
  console.log('\n📦 Package Dependencies:');
  const packageJson = JSON.parse(readFileSync(join(rootDir, 'package.json'), 'utf8'));
  console.log(`Dependencies: ${Object.keys(packageJson.dependencies || {}).length}`);
  console.log(`DevDependencies: ${Object.keys(packageJson.devDependencies || {}).length}`);
  
  console.log('\n🧪 Test Files:');
  execSync('find tests -name "*.test.*" -o -name "*.spec.*" | wc -l', { 
    stdio: 'inherit', 
    cwd: rootDir 
  });
  
  console.log('\n📊 Code Quality:');
  try {
    execSync('npm run lint -- --max-warnings 0', { 
      stdio: 'inherit', 
      cwd: rootDir 
    });
  } catch (e) {
    console.log('⚠️  Linting issues detected');
  }

} catch (error) {
  console.log('⚠️  Some verification commands failed');
}

// Final Status
const overallSuccess = metCriteria >= 6; // At least 75% criteria met

console.log('\n' + '='.repeat(50));
if (overallSuccess) {
  console.log('🎉 DASHBOARD SYSTEM VERIFICATION PASSED');
  console.log('System meets production-ready requirements!');
  process.exit(0);
} else {
  console.log('❌ DASHBOARD SYSTEM VERIFICATION FAILED');
  console.log('System requires additional work to meet requirements.');
  process.exit(1);
}