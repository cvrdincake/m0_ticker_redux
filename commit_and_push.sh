#!/bin/bash
set -e

echo "🚀 Committing PopupAlert broadcast overlay pattern integration..."

# Add all files
git add .

# Commit with descriptive message
git commit -m "feat: integrate PopupAlert as broadcast overlay pattern

- ✅ Implement PopupAlert component with portal rendering
- ✅ Add comprehensive CSS with tokens & motion policies ≤240ms
- ✅ Build usePopupQueue hook with serialized queue management
- ✅ Create 6 Storybook stories with interactive demos
- ✅ Write 40+ test cases covering all functionality  
- ✅ Add OverlayDemo page for usage examples
- ✅ Full accessibility (role=alert, aria-live=assertive)
- ✅ Hover pause, Esc dismiss, reduced motion support
- ✅ z-index layering (110) with proper portal mounting

Following atomic design structure with complete token integration.
Broadcast overlay pattern ready for production use."

# Check current branch
CURRENT_BRANCH=$(git branch --show-current)
echo "📋 Current branch: $CURRENT_BRANCH"

# If on feature branch, merge to main, otherwise just push
if [ "$CURRENT_BRANCH" != "main" ]; then
    echo "🔄 Switching to main branch..."
    git checkout main
    
    echo "📥 Merging $CURRENT_BRANCH into main..."
    git merge $CURRENT_BRANCH --no-ff -m "merge: integrate PopupAlert broadcast overlay pattern

Complete implementation with tests, stories, and documentation."
    
    echo "🗑️  Deleting feature branch $CURRENT_BRANCH..."
    git branch -d $CURRENT_BRANCH
fi

echo "📤 Pushing to remote repository..."
git push origin main

echo "✨ Successfully committed, merged, and pushed PopupAlert integration!"
echo ""
echo "🎯 Integration Summary:"
echo "   • PopupAlert component with portal rendering"
echo "   • Token-based styling with motion policies"
echo "   • Queue management with usePopupQueue hook"
echo "   • 6 Storybook stories + comprehensive tests"  
echo "   • Full accessibility & reduced motion support"
echo "   • Ready for production use"