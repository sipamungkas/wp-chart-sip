<?php
/**
 * Plugin Name:       WP Chart SIP
 * Plugin URI:        https://github.com/sipamungkas/wp-chart-sip
 * Description:       A beautiful WordPress plugin to create and embed interactive charts in your posts using shortcodes. Powered by ApexCharts.
 * Version:           1.0.0
 * Requires at least: 5.8
 * Requires PHP:      7.4
 * Author:            Sipa Mungkas
 * Author URI:        https://github.com/sipamungkas
 * License:           GPL v2 or later
 * License URI:       https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain:       wp-chart-sip
 * Domain Path:       /languages
 */

// If this file is called directly, abort.
if ( ! defined( 'WPINC' ) ) {
	die;
}

/**
 * Current plugin version.
 */
define( 'WCSP_VERSION', '1.0.0' );
define( 'WCSP_PLUGIN_DIR', plugin_dir_path( __FILE__ ) );
define( 'WCSP_PLUGIN_URL', plugin_dir_url( __FILE__ ) );
define( 'WCSP_PLUGIN_BASENAME', plugin_basename( __FILE__ ) );

/**
 * The code that runs during plugin activation.
 */
function wcsp_activate_plugin() {
	require_once WCSP_PLUGIN_DIR . 'includes/class-wcsp-activator.php';
	WCSP_Activator::activate();
}

/**
 * The code that runs during plugin deactivation.
 */
function wcsp_deactivate_plugin() {
	require_once WCSP_PLUGIN_DIR . 'includes/class-wcsp-activator.php';
	WCSP_Activator::deactivate();
}

register_activation_hook( __FILE__, 'wcsp_activate_plugin' );
register_deactivation_hook( __FILE__, 'wcsp_deactivate_plugin' );

/**
 * The core plugin class.
 */
require WCSP_PLUGIN_DIR . 'includes/class-wcsp-loader.php';
require WCSP_PLUGIN_DIR . 'includes/class-wcsp-chart.php';
require WCSP_PLUGIN_DIR . 'admin/class-wcsp-admin.php';
require WCSP_PLUGIN_DIR . 'public/class-wcsp-public.php';

/**
 * Begins execution of the plugin.
 */
function wcsp_run_plugin() {
	$loader = new WCSP_Loader();
	$loader->run();
}

wcsp_run_plugin();
