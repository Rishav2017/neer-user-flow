# QuickCart Express

A modern grocery delivery application offering instant delivery with zero fees, blockbuster deals, and easy shopping across multiple categories.

## Project Description

QuickCart Express is a comprehensive grocery delivery app that provides users with a seamless shopping experience. The app features instant delivery options, zero handling and delivery fees, and exclusive blockbuster deals on popular products. Users can browse through various categories including fresh produce, electronics, fashion, and more.

## Style Guide

### Brand Colors
- **Primary**: #A855F7 (Purple 500)
- **Secondary**: #EC4899 (Pink 500)
- **Accent**: #10B981 (Green 500)
- **Background**: #F3E8FF (Purple 100)
- **Surface**: #FFFFFF (White)
- **Text**: #111827 (Gray 900)
- **Text Secondary**: #6B7280 (Gray 500)

### Theme
- **Style**: Modern, clean, and vibrant
- **Mood**: Energetic and user-friendly
- **Visual Weight**: Medium with bold accents

### Spacing
- **Border Radius**: rounded-2xl for cards, rounded-full for buttons
- **Padding**: p-4 for containers, p-3 for cards
- **Margin**: mb-4 for sections, gap-12 for horizontal lists

### Typography
- **Headings**: Bold, text-2xl for main headings
- **Body**: text-base for primary text, text-sm for secondary
- **Labels**: text-xs for small labels and tags

## Features

- **Zero Fees**: No handling, delivery, or surge fees
- **Quick Delivery**: 15-minute delivery promise
- **Category Browsing**: Easy navigation through Fresh, Electronics, Fashion, and more
- **Blockbuster Deals**: Exclusive discounts on popular products
- **Smart Search**: Quick search functionality for products
- **Wishlist**: Save favorite items with heart icon
- **Location Selection**: Easy address management
- **Bottom Navigation**: Quick access to Home, Categories, Buy Again, and Café

## Technologies Used

- **React Native**: Cross-platform mobile development
- **Expo Router**: File-based routing system
- **NativeWind**: Tailwind CSS for React Native
- **Lucide React Native**: Modern icon library
- **TypeScript**: Type-safe development

## Installation Instructions

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm start
   ```
4. Run on your preferred platform:
   - iOS: `npm run ios`
   - Android: `npm run android`
   - Web: `npm run web`

## Usage Instructions

1. **Browse Categories**: Tap on category icons to filter products
2. **Search Products**: Use the search bar to find specific items
3. **Add to Cart**: Tap the "ADD" button on product cards
4. **Save Favorites**: Tap the heart icon to add items to wishlist
5. **Navigate**: Use bottom navigation to access different sections
6. **Change Location**: Tap on the address header to select delivery location

## Project Structure

```
app/
  ├── index.tsx          # Main home screen
  └── _layout.tsx        # Root layout configuration
components/              # Reusable components (future)
assets/                  # Images and static files
```

## Design Principles

- **Mobile-First**: Optimized for touch interactions and small screens
- **Visual Hierarchy**: Clear emphasis on deals and important actions
- **Consistent Spacing**: Uniform padding and margins throughout
- **Brand Identity**: Purple theme reflecting the Zepto-inspired design
- **Accessibility**: Proper contrast ratios and touch targets
```