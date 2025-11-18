<?php
/**
 * Fired during plugin activation and deactivation.
 *
 * @package    WP_Chart_SIP
 * @subpackage WP_Chart_SIP/includes
 */

class WCSP_Activator {

	/**
	 * Activate the plugin.
	 *
	 * Creates custom post type and flushes rewrite rules.
	 */
	public static function activate() {
		// Register the custom post type
		self::register_chart_post_type();

		// Flush rewrite rules
		flush_rewrite_rules();

		// Set default options
		add_option( 'wcsp_version', WCSP_VERSION );
	}

	/**
	 * Deactivate the plugin.
	 *
	 * Flushes rewrite rules on deactivation.
	 */
	public static function deactivate() {
		flush_rewrite_rules();
	}

	/**
	 * Register chart post type (needed for activation).
	 */
	private static function register_chart_post_type() {
		$labels = array(
			'name'               => __( 'Charts', 'wp-chart-sip' ),
			'singular_name'      => __( 'Chart', 'wp-chart-sip' ),
			'add_new'            => __( 'Add New Chart', 'wp-chart-sip' ),
			'add_new_item'       => __( 'Add New Chart', 'wp-chart-sip' ),
			'edit_item'          => __( 'Edit Chart', 'wp-chart-sip' ),
			'new_item'           => __( 'New Chart', 'wp-chart-sip' ),
			'view_item'          => __( 'View Chart', 'wp-chart-sip' ),
			'search_items'       => __( 'Search Charts', 'wp-chart-sip' ),
			'not_found'          => __( 'No charts found', 'wp-chart-sip' ),
			'not_found_in_trash' => __( 'No charts found in trash', 'wp-chart-sip' ),
		);

		$args = array(
			'labels'              => $labels,
			'public'              => false,
			'show_ui'             => true,
			'show_in_menu'        => true,
			'menu_icon'           => 'dashicons-chart-bar',
			'capability_type'     => 'post',
			'hierarchical'        => false,
			'supports'            => array( 'title' ),
			'has_archive'         => false,
			'rewrite'             => false,
			'query_var'           => false,
		);

		register_post_type( 'wcsp_chart', $args );
	}
}
