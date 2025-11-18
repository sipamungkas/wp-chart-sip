# Color Templates for WP Chart SIP

This document provides an overview of the color template system and examples of all available color palettes.

## Overview

The Color Templates feature allows you to quickly apply professionally designed color schemes to your charts. Instead of manually entering color codes, you can select from 21 predefined templates organized by category.

## How to Use

### In Simple Mode (GUI):

1. Navigate to the chart editing screen
2. Under **Chart Styling**, find the **Color Template** dropdown
3. Select a template from the categorized list
4. The colors will automatically populate in the **Custom Colors** field
5. A visual preview of the color swatches will appear below the dropdown
6. (Optional) You can still manually edit the colors after selecting a template

### In JSON Mode:

After selecting a template in Simple Mode, switch to JSON Mode to see the colors applied:

```json
{
  "colors": ["#008FFB", "#00E396", "#FEB019", "#FF4560", "#775DD0", "#546E7A", "#26a69a", "#D10CE8"]
}
```

You can also manually add the `colors` array to your chart options JSON.

## Available Templates

### Standard

#### 1. ApexCharts Default
- **Colors**: `#008FFB`, `#00E396`, `#FEB019`, `#FF4560`, `#775DD0`, `#546E7A`, `#26a69a`, `#D10CE8`
- **Use Case**: Default ApexCharts color scheme, suitable for general purpose charts
- **Best For**: Line charts, bar charts, mixed data visualizations

#### 2. Modern
- **Colors**: `#1ABC9C`, `#3498DB`, `#9B59B6`, `#E74C3C`, `#F39C12`, `#2ECC71`, `#E67E22`, `#95A5A6`
- **Use Case**: Contemporary flat design aesthetic
- **Best For**: Dashboard widgets, modern web applications

#### 3. Retro
- **Colors**: `#E63946`, `#F1FAEE`, `#A8DADC`, `#457B9D`, `#1D3557`, `#E76F51`, `#2A9D8F`, `#264653`
- **Use Case**: Vintage-inspired color palette
- **Best For**: Creative projects, nostalgic themes

### Business

#### 4. Professional
- **Colors**: `#2E4053`, `#5DADE2`, `#48C9B0`, `#F39C12`, `#E74C3C`, `#9B59B6`, `#34495E`, `#16A085`
- **Use Case**: Professional business presentations
- **Best For**: Corporate reports, business analytics, KPI dashboards

#### 5. Corporate
- **Colors**: `#1C3144`, `#2A4A5F`, `#3E6680`, `#5B8BA0`, `#78A9C0`, `#95C7DF`, `#B2D8ED`, `#345B72`
- **Use Case**: Conservative corporate environment
- **Best For**: Financial reports, executive presentations

### Colorful

#### 6. Vibrant
- **Colors**: `#FF6B6B`, `#4ECDC4`, `#45B7D1`, `#FFA07A`, `#98D8C8`, `#F7DC6F`, `#BB8FCE`, `#85C1E2`
- **Use Case**: Bold and energetic visualizations
- **Best For**: Marketing materials, social media graphics

#### 7. Neon
- **Colors**: `#FF006E`, `#00F5FF`, `#FFBE0B`, `#FB5607`, `#8338EC`, `#3A86FF`, `#06FFA5`, `#FF006E`
- **Use Case**: High-energy, attention-grabbing charts
- **Best For**: Youth-oriented content, gaming metrics

#### 8. Tropical
- **Colors**: `#06FFA5`, `#00D9FF`, `#FFBA08`, `#FF006E`, `#8338EC`, `#3A86FF`, `#FB5607`, `#06FFA5`
- **Use Case**: Bright, summery feel
- **Best For**: Travel sites, lifestyle apps

#### 9. Candy
- **Colors**: `#FF69B4`, `#FF1493`, `#FFC0CB`, `#FFB6C1`, `#DB7093`, `#C71585`, `#FF85C1`, `#FFB3D9`
- **Use Case**: Sweet, playful aesthetic
- **Best For**: Children's content, entertainment

### Soft & Pastel

#### 10. Pastel
- **Colors**: `#FFB3BA`, `#BAFFC9`, `#BAE1FF`, `#FFFFBA`, `#FFDFBA`, `#E0BBE4`, `#C9C9FF`, `#FFC9DE`
- **Use Case**: Gentle, calming color scheme
- **Best For**: Health & wellness, baby products, soft data presentations

#### 11. Spring
- **Colors**: `#FFB6D9`, `#FFCCE1`, `#FFE5EC`, `#D8F3DC`, `#B7E4C7`, `#95D5B2`, `#74C69D`, `#52B788`
- **Use Case**: Fresh, renewal-themed palette
- **Best For**: Environmental data, seasonal content

### Nature

#### 12. Ocean
- **Colors**: `#006994`, `#0582CA`, `#00A6FB`, `#51C4D3`, `#6DD3CE`, `#9DF3C4`, `#D4F4DD`, `#83C9F4`
- **Use Case**: Cool, aquatic theme
- **Best For**: Marine data, water conservation, travel

#### 13. Forest
- **Colors**: `#2D4A2B`, `#3E885B`, `#4E9F3D`, `#8BC34A`, `#AED581`, `#C5E1A5`, `#689F38`, `#558B2F`
- **Use Case**: Natural, eco-friendly palette
- **Best For**: Environmental reports, organic products, sustainability metrics

#### 14. Earth
- **Colors**: `#8B4513`, `#A0522D`, `#CD853F`, `#DEB887`, `#D2691E`, `#BC8F8F`, `#F4A460`, `#B8860B`
- **Use Case**: Warm, grounded natural tones
- **Best For**: Agriculture, real estate, geological data

### Warm

#### 15. Sunset
- **Colors**: `#FF6B35`, `#F7931E`, `#FDC830`, `#F37335`, `#FF5733`, `#C70039`, `#900C3F`, `#E67E22`
- **Use Case**: Warm, energetic gradient
- **Best For**: Evening events, warm climate data

#### 16. Autumn
- **Colors**: `#D62828`, `#F77F00`, `#FCBF49`, `#EAE2B7`, `#8B4513`, `#A0522D`, `#CD5C5C`, `#D2691E`
- **Use Case**: Fall-inspired, cozy palette
- **Best For**: Seasonal sales, harvest data

### Monochrome

#### 17. Monochrome Blue
- **Colors**: `#E3F2FD`, `#90CAF9`, `#64B5F6`, `#42A5F5`, `#2196F3`, `#1E88E5`, `#1976D2`, `#1565C0`
- **Use Case**: Single-hue gradient from light to dark
- **Best For**: Clean, focused data visualization, professional presentations

#### 18. Monochrome Purple
- **Colors**: `#F3E5F5`, `#CE93D8`, `#BA68C8`, `#AB47BC`, `#9C27B0`, `#8E24AA`, `#7B1FA2`, `#6A1B9A`
- **Use Case**: Elegant purple gradient
- **Best For**: Creative industries, luxury brands

#### 19. Monochrome Green
- **Colors**: `#E8F5E9`, `#81C784`, `#66BB6A`, `#4CAF50`, `#43A047`, `#388E3C`, `#2E7D32`, `#1B5E20`
- **Use Case**: Green gradient for growth metrics
- **Best For**: Financial growth, health metrics, eco-friendly themes

#### 20. Grayscale
- **Colors**: `#2C3E50`, `#34495E`, `#566573`, `#717D8A`, `#85929E`, `#A6ACAF`, `#BDC3C7`, `#D5DBDB`
- **Use Case**: Neutral, professional black-to-white gradient
- **Best For**: Print publications, minimalist design, accessibility-focused charts

### Dark

#### 21. Midnight
- **Colors**: `#191970`, `#1C1C3C`, `#2E2E5E`, `#4B0082`, `#483D8B`, `#6A5ACD`, `#7B68EE`, `#9370DB`
- **Use Case**: Dark, mysterious theme
- **Best For**: Night-mode interfaces, tech products

## Example Use Cases

### Sales Dashboard
**Recommended Template**: Professional or Modern
```json
{
  "colors": ["#2E4053", "#5DADE2", "#48C9B0", "#F39C12"]
}
```

### Environmental Report
**Recommended Template**: Forest or Ocean
```json
{
  "colors": ["#2D4A2B", "#3E885B", "#4E9F3D", "#8BC34A"]
}
```

### Marketing Campaign
**Recommended Template**: Vibrant or Tropical
```json
{
  "colors": ["#FF6B6B", "#4ECDC4", "#45B7D1", "#FFA07A"]
}
```

### Financial Analysis
**Recommended Template**: Corporate or Monochrome Blue
```json
{
  "colors": ["#1C3144", "#2A4A5F", "#3E6680", "#5B8BA0"]
}
```

## Creating Custom Colors

While templates provide quick solutions, you can always customize:

1. Select a template as a starting point
2. Manually edit the colors in the **Custom Colors** field
3. Mix and match colors from different templates
4. Add your brand colors

## Code Reference

All color templates are defined in: `includes/class-wcsp-color-templates.php:18`

To add a new template programmatically, you can filter the templates:

```php
add_filter('wcsp_color_templates', function($templates) {
    $templates['my_brand'] = array(
        'name'        => 'My Brand',
        'description' => 'Custom brand colors',
        'colors'      => array('#FF0000', '#00FF00', '#0000FF'),
        'category'    => 'custom',
    );
    return $templates;
});
```

## Tips for Choosing Colors

1. **Accessibility**: Ensure sufficient contrast for readability
2. **Color Blindness**: Use patterns or labels in addition to colors
3. **Data Type**: Match palette mood to data context (warm for positive growth, cool for calm analysis)
4. **Brand Consistency**: Consider using brand colors for external-facing charts
5. **Number of Series**: Some templates work better with fewer data series

## Support

For questions or custom template requests, please visit the [GitHub repository](https://github.com/sipamungkas/wp-chart-sip).
