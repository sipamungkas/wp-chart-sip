<?php
/**
 * Color Templates for Charts
 *
 * Provides predefined color palettes for chart customization.
 *
 * @package    WP_Chart_SIP
 * @subpackage WP_Chart_SIP/includes
 */

/**
 * Color Templates Class
 *
 * Defines and manages predefined color templates/palettes for charts.
 */
class WCSP_Color_Templates {

	/**
	 * Get all available color templates
	 *
	 * @return array Array of color templates with their configurations
	 */
	public static function get_templates() {
		return array(
			'default' => array(
				'name'        => __( 'ApexCharts Default', 'wp-chart-sip' ),
				'description' => __( 'Default ApexCharts color palette', 'wp-chart-sip' ),
				'colors'      => array( '#008FFB', '#00E396', '#FEB019', '#FF4560', '#775DD0', '#546E7A', '#26a69a', '#D10CE8' ),
				'category'    => 'standard',
			),
			'professional' => array(
				'name'        => __( 'Professional', 'wp-chart-sip' ),
				'description' => __( 'Professional business color scheme', 'wp-chart-sip' ),
				'colors'      => array( '#2E4053', '#5DADE2', '#48C9B0', '#F39C12', '#E74C3C', '#9B59B6', '#34495E', '#16A085' ),
				'category'    => 'business',
			),
			'vibrant' => array(
				'name'        => __( 'Vibrant', 'wp-chart-sip' ),
				'description' => __( 'Bold and energetic colors', 'wp-chart-sip' ),
				'colors'      => array( '#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E2' ),
				'category'    => 'colorful',
			),
			'pastel' => array(
				'name'        => __( 'Pastel', 'wp-chart-sip' ),
				'description' => __( 'Soft and gentle pastel tones', 'wp-chart-sip' ),
				'colors'      => array( '#FFB3BA', '#BAFFC9', '#BAE1FF', '#FFFFBA', '#FFDFBA', '#E0BBE4', '#C9C9FF', '#FFC9DE' ),
				'category'    => 'soft',
			),
			'ocean' => array(
				'name'        => __( 'Ocean', 'wp-chart-sip' ),
				'description' => __( 'Cool blue and teal shades', 'wp-chart-sip' ),
				'colors'      => array( '#006994', '#0582CA', '#00A6FB', '#51C4D3', '#6DD3CE', '#9DF3C4', '#D4F4DD', '#83C9F4' ),
				'category'    => 'nature',
			),
			'sunset' => array(
				'name'        => __( 'Sunset', 'wp-chart-sip' ),
				'description' => __( 'Warm sunset-inspired palette', 'wp-chart-sip' ),
				'colors'      => array( '#FF6B35', '#F7931E', '#FDC830', '#F37335', '#FF5733', '#C70039', '#900C3F', '#E67E22' ),
				'category'    => 'warm',
			),
			'forest' => array(
				'name'        => __( 'Forest', 'wp-chart-sip' ),
				'description' => __( 'Natural green tones', 'wp-chart-sip' ),
				'colors'      => array( '#2D4A2B', '#3E885B', '#4E9F3D', '#8BC34A', '#AED581', '#C5E1A5', '#689F38', '#558B2F' ),
				'category'    => 'nature',
			),
			'monochrome_blue' => array(
				'name'        => __( 'Monochrome Blue', 'wp-chart-sip' ),
				'description' => __( 'Shades of blue from light to dark', 'wp-chart-sip' ),
				'colors'      => array( '#E3F2FD', '#90CAF9', '#64B5F6', '#42A5F5', '#2196F3', '#1E88E5', '#1976D2', '#1565C0' ),
				'category'    => 'monochrome',
			),
			'monochrome_purple' => array(
				'name'        => __( 'Monochrome Purple', 'wp-chart-sip' ),
				'description' => __( 'Shades of purple from light to dark', 'wp-chart-sip' ),
				'colors'      => array( '#F3E5F5', '#CE93D8', '#BA68C8', '#AB47BC', '#9C27B0', '#8E24AA', '#7B1FA2', '#6A1B9A' ),
				'category'    => 'monochrome',
			),
			'monochrome_green' => array(
				'name'        => __( 'Monochrome Green', 'wp-chart-sip' ),
				'description' => __( 'Shades of green from light to dark', 'wp-chart-sip' ),
				'colors'      => array( '#E8F5E9', '#81C784', '#66BB6A', '#4CAF50', '#43A047', '#388E3C', '#2E7D32', '#1B5E20' ),
				'category'    => 'monochrome',
			),
			'corporate' => array(
				'name'        => __( 'Corporate', 'wp-chart-sip' ),
				'description' => __( 'Conservative corporate colors', 'wp-chart-sip' ),
				'colors'      => array( '#1C3144', '#2A4A5F', '#3E6680', '#5B8BA0', '#78A9C0', '#95C7DF', '#B2D8ED', '#345B72' ),
				'category'    => 'business',
			),
			'modern' => array(
				'name'        => __( 'Modern', 'wp-chart-sip' ),
				'description' => __( 'Contemporary flat design colors', 'wp-chart-sip' ),
				'colors'      => array( '#1ABC9C', '#3498DB', '#9B59B6', '#E74C3C', '#F39C12', '#2ECC71', '#E67E22', '#95A5A6' ),
				'category'    => 'standard',
			),
			'earth' => array(
				'name'        => __( 'Earth', 'wp-chart-sip' ),
				'description' => __( 'Natural earth tones', 'wp-chart-sip' ),
				'colors'      => array( '#8B4513', '#A0522D', '#CD853F', '#DEB887', '#D2691E', '#BC8F8F', '#F4A460', '#B8860B' ),
				'category'    => 'nature',
			),
			'neon' => array(
				'name'        => __( 'Neon', 'wp-chart-sip' ),
				'description' => __( 'Bright neon colors', 'wp-chart-sip' ),
				'colors'      => array( '#FF006E', '#00F5FF', '#FFBE0B', '#FB5607', '#8338EC', '#3A86FF', '#06FFA5', '#FF006E' ),
				'category'    => 'colorful',
			),
			'autumn' => array(
				'name'        => __( 'Autumn', 'wp-chart-sip' ),
				'description' => __( 'Fall-inspired warm colors', 'wp-chart-sip' ),
				'colors'      => array( '#D62828', '#F77F00', '#FCBF49', '#EAE2B7', '#8B4513', '#A0522D', '#CD5C5C', '#D2691E' ),
				'category'    => 'warm',
			),
			'spring' => array(
				'name'        => __( 'Spring', 'wp-chart-sip' ),
				'description' => __( 'Fresh spring colors', 'wp-chart-sip' ),
				'colors'      => array( '#FFB6D9', '#FFCCE1', '#FFE5EC', '#D8F3DC', '#B7E4C7', '#95D5B2', '#74C69D', '#52B788' ),
				'category'    => 'soft',
			),
			'grayscale' => array(
				'name'        => __( 'Grayscale', 'wp-chart-sip' ),
				'description' => __( 'Black to white gradient', 'wp-chart-sip' ),
				'colors'      => array( '#2C3E50', '#34495E', '#566573', '#717D8A', '#85929E', '#A6ACAF', '#BDC3C7', '#D5DBDB' ),
				'category'    => 'monochrome',
			),
			'retro' => array(
				'name'        => __( 'Retro', 'wp-chart-sip' ),
				'description' => __( 'Vintage retro color scheme', 'wp-chart-sip' ),
				'colors'      => array( '#E63946', '#F1FAEE', '#A8DADC', '#457B9D', '#1D3557', '#E76F51', '#2A9D8F', '#264653' ),
				'category'    => 'standard',
			),
			'candy' => array(
				'name'        => __( 'Candy', 'wp-chart-sip' ),
				'description' => __( 'Sweet candy-inspired colors', 'wp-chart-sip' ),
				'colors'      => array( '#FF69B4', '#FF1493', '#FFC0CB', '#FFB6C1', '#DB7093', '#C71585', '#FF85C1', '#FFB3D9' ),
				'category'    => 'colorful',
			),
			'midnight' => array(
				'name'        => __( 'Midnight', 'wp-chart-sip' ),
				'description' => __( 'Dark midnight blues and purples', 'wp-chart-sip' ),
				'colors'      => array( '#191970', '#1C1C3C', '#2E2E5E', '#4B0082', '#483D8B', '#6A5ACD', '#7B68EE', '#9370DB' ),
				'category'    => 'dark',
			),
			'tropical' => array(
				'name'        => __( 'Tropical', 'wp-chart-sip' ),
				'description' => __( 'Bright tropical colors', 'wp-chart-sip' ),
				'colors'      => array( '#06FFA5', '#00D9FF', '#FFBA08', '#FF006E', '#8338EC', '#3A86FF', '#FB5607', '#06FFA5' ),
				'category'    => 'colorful',
			),
		);
	}

	/**
	 * Get template by ID
	 *
	 * @param string $template_id Template identifier
	 * @return array|null Template data or null if not found
	 */
	public static function get_template( $template_id ) {
		$templates = self::get_templates();
		return isset( $templates[ $template_id ] ) ? $templates[ $template_id ] : null;
	}

	/**
	 * Get colors for a specific template
	 *
	 * @param string $template_id Template identifier
	 * @return array Array of color hex codes
	 */
	public static function get_template_colors( $template_id ) {
		$template = self::get_template( $template_id );
		return $template ? $template['colors'] : array();
	}

	/**
	 * Get templates grouped by category
	 *
	 * @return array Templates organized by category
	 */
	public static function get_templates_by_category() {
		$templates = self::get_templates();
		$categorized = array();

		foreach ( $templates as $id => $template ) {
			$category = isset( $template['category'] ) ? $template['category'] : 'other';
			if ( ! isset( $categorized[ $category ] ) ) {
				$categorized[ $category ] = array();
			}
			$categorized[ $category ][ $id ] = $template;
		}

		return $categorized;
	}

	/**
	 * Get category labels
	 *
	 * @return array Category names with translations
	 */
	public static function get_category_labels() {
		return array(
			'standard'   => __( 'Standard', 'wp-chart-sip' ),
			'business'   => __( 'Business', 'wp-chart-sip' ),
			'colorful'   => __( 'Colorful', 'wp-chart-sip' ),
			'soft'       => __( 'Soft & Pastel', 'wp-chart-sip' ),
			'nature'     => __( 'Nature', 'wp-chart-sip' ),
			'warm'       => __( 'Warm', 'wp-chart-sip' ),
			'monochrome' => __( 'Monochrome', 'wp-chart-sip' ),
			'dark'       => __( 'Dark', 'wp-chart-sip' ),
			'other'      => __( 'Other', 'wp-chart-sip' ),
		);
	}
}
