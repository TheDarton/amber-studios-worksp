# Assets Directory

This directory contains all application assets organized by type:

## Structure
- `images/` - Logo, icons, and imagery
- `video/` - Training videos and media content  
- `audio/` - Sound effects and notifications
- `documents/` - PDF guides and documentation

## Logo
The company logo can be placed in `images/logo.png` and updated after site launch.

## Usage
Always import assets explicitly in components:

```typescript
import logo from '@/assets/images/logo.png'
import trainingVideo from '@/assets/video/onboarding.mp4'

// Then use in JSX
<img src={logo} alt="Amber Studios" />
<video src={trainingVideo} />
```