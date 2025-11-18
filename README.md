# WP Chart SIP - Simple Interactive Plugin

A beautiful WordPress plugin to create and embed interactive charts in your posts and pages using shortcodes. Powered by ApexCharts for stunning visualizations.

## Features

- **Multiple Chart Types**: Support for Line, Bar, Pie, Donut, Area, Radar, Scatter, and Heatmap charts
- **Beautiful Design**: Powered by ApexCharts with modern, responsive designs
- **Easy to Use**: Simple shortcode implementation `[wcsp_chart id="123"]`
- **Admin Interface**: User-friendly chart builder with live preview
- **Customizable**: Full control over chart data and styling via JSON configuration
- **Responsive**: Charts automatically adapt to different screen sizes
- **Translation Ready**: Fully internationalized with text domain support

## Installation

1. Upload the `wp-chart-sip` folder to the `/wp-content/plugins/` directory
2. Activate the plugin through the 'Plugins' menu in WordPress
3. Go to 'Charts' in the admin menu to create your first chart

## Usage

### Creating a Chart

1. Navigate to **Charts > Add New Chart** in your WordPress admin
2. Enter a title for your chart
3. Select a chart type from the dropdown
4. Enter your chart data in JSON format
5. (Optional) Customize chart appearance with additional options
6. Click **Preview Chart** to see how it looks
7. Publish the chart

### Chart Data Format

**Example for Line/Bar/Area Charts:**
```json
{
  "series": [{
    "name": "Sales",
    "data": [30, 40, 35, 50, 49, 60, 70, 91, 125]
  }],
  "categories": ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep"]
}
```

**Example for Pie/Donut Charts:**
```json
{
  "series": [44, 55, 13, 43, 22],
  "labels": ["Team A", "Team B", "Team C", "Team D", "Team E"]
}
```

### Chart Options (Optional)

Customize your chart appearance:
```json
{
  "colors": ["#008FFB", "#00E396", "#FEB019"],
  "title": {
    "text": "Monthly Sales Report",
    "align": "left"
  },
  "legend": {
    "position": "bottom"
  }
}
```

### Embedding Charts

Use the shortcode with your chart ID:
```
[wcsp_chart id="123"]
```

**Shortcode Attributes:**
- `id` (required): The chart post ID
- `width` (optional): Chart width (default: 100%)
- `height` (optional): Chart height in pixels (default: 350)

**Example:**
```
[wcsp_chart id="123" height="500"]
```

### Insert Chart Button

When editing posts or pages, use the **Insert Chart** button above the editor to easily select and insert charts.

## Plugin Structure

```
wp-chart-sip/
├── wp-chart-sip.php          # Main plugin file
├── uninstall.php             # Cleanup on uninstall
├── .gitignore
├── README.md
├── includes/
│   ├── class-wcsp-chart.php      # Chart post type & data handling
│   ├── class-wcsp-loader.php     # Hooks loader
│   └── class-wcsp-activator.php  # Activation/deactivation
├── admin/
│   ├── class-wcsp-admin.php      # Admin functionality
│   ├── css/wcsp-admin.css        # Admin styles
│   ├── js/wcsp-admin.js          # Admin scripts
│   └── views/chart-meta-box.php  # Meta box template
├── public/
│   ├── class-wcsp-public.php     # Shortcode & front-end
│   ├── css/wcsp-public.css       # Public styles
│   └── js/wcsp-public.js         # Public scripts
└── languages/                     # Translation files
```

## Best Practices

### Security
- All user inputs are sanitized using WordPress functions
- All outputs are properly escaped
- Nonce verification for form submissions
- Capability checks for user permissions

### Code Organization
- Follows WordPress coding standards
- Object-oriented architecture
- Separation of concerns (admin/public)
- Proper use of WordPress hooks and filters

### Performance
- Scripts only loaded when needed
- Responsive and lightweight
- Optimized for fast rendering

## Development

### Requirements
- WordPress 5.8 or higher
- PHP 7.4 or higher

### Coding Standards
This plugin follows the [WordPress Coding Standards](https://developer.wordpress.org/coding-standards/wordpress-coding-standards/).

## Chart Library

This plugin uses [ApexCharts](https://apexcharts.com/) - a modern charting library that helps create beautiful and interactive visualizations.

For advanced customization, refer to the [ApexCharts Documentation](https://apexcharts.com/docs/).

## Support

For issues and questions:
- [GitHub Issues](https://github.com/sipamungkas/wp-chart-sip/issues)

## License

GPL v2 or later

## Credits

- **Author**: Sipa Mungkas
- **Chart Library**: ApexCharts
- **Inspired by**: WordPress plugin development best practices

## Changelog

### 1.0.0
- Initial release
- Support for 8 chart types
- Admin interface with live preview
- Shortcode implementation
- Insert chart button for editor
- Responsive design
- Translation ready
