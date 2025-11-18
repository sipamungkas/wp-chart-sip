<?php
/**
 * Fired when the plugin is uninstalled.
 *
 * @package WP_Chart_SIP
 */

// If uninstall not called from WordPress, exit.
if ( ! defined( 'WP_UNINSTALL_PLUGIN' ) ) {
	exit;
}

/**
 * Delete all chart posts and metadata.
 */
function wcsp_uninstall() {
	global $wpdb;

	// Delete all chart posts
	$charts = get_posts(
		array(
			'post_type'      => 'wcsp_chart',
			'posts_per_page' => -1,
			'post_status'    => 'any',
		)
	);

	foreach ( $charts as $chart ) {
		wp_delete_post( $chart->ID, true );
	}

	// Delete plugin options
	delete_option( 'wcsp_version' );

	// Clear any cached data
	wp_cache_flush();
}

wcsp_uninstall();
