<?php
/**
 * Register all actions and filters for the plugin.
 *
 * @package    WP_Chart_SIP
 * @subpackage WP_Chart_SIP/includes
 */

class WCSP_Loader {

	/**
	 * The array of actions registered with WordPress.
	 */
	protected $actions;

	/**
	 * The array of filters registered with WordPress.
	 */
	protected $filters;

	/**
	 * Initialize the collections used to maintain the actions and filters.
	 */
	public function __construct() {
		$this->actions = array();
		$this->filters = array();
	}

	/**
	 * Add a new action to the collection to be registered with WordPress.
	 */
	public function add_action( $hook, $component, $callback, $priority = 10, $accepted_args = 1 ) {
		$this->actions = $this->add( $this->actions, $hook, $component, $callback, $priority, $accepted_args );
	}

	/**
	 * Add a new filter to the collection to be registered with WordPress.
	 */
	public function add_filter( $hook, $component, $callback, $priority = 10, $accepted_args = 1 ) {
		$this->filters = $this->add( $this->filters, $hook, $component, $callback, $priority, $accepted_args );
	}

	/**
	 * A utility function that is used to register the actions and hooks into a single collection.
	 */
	private function add( $hooks, $hook, $component, $callback, $priority, $accepted_args ) {
		$hooks[] = array(
			'hook'          => $hook,
			'component'     => $component,
			'callback'      => $callback,
			'priority'      => $priority,
			'accepted_args' => $accepted_args,
		);

		return $hooks;
	}

	/**
	 * Register the filters and actions with WordPress.
	 */
	public function run() {
		// Initialize components
		$chart = new WCSP_Chart();
		$admin = new WCSP_Admin();
		$public = new WCSP_Public();

		// Register chart post type
		$this->add_action( 'init', $chart, 'register_post_type' );
		$this->add_action( 'add_meta_boxes', $admin, 'add_meta_boxes' );
		$this->add_action( 'save_post_wcsp_chart', $admin, 'save_chart_data', 10, 2 );

		// Admin scripts and styles
		$this->add_action( 'admin_enqueue_scripts', $admin, 'enqueue_styles' );
		$this->add_action( 'admin_enqueue_scripts', $admin, 'enqueue_scripts' );

		// Public scripts and styles
		$this->add_action( 'wp_enqueue_scripts', $public, 'enqueue_styles' );
		$this->add_action( 'wp_enqueue_scripts', $public, 'enqueue_scripts' );

		// Register shortcode
		$this->add_action( 'init', $public, 'register_shortcode' );

		// Add shortcode button to editor
		$this->add_action( 'media_buttons', $admin, 'add_chart_button' );

		// Execute hooks
		foreach ( $this->filters as $hook ) {
			add_filter( $hook['hook'], array( $hook['component'], $hook['callback'] ), $hook['priority'], $hook['accepted_args'] );
		}

		foreach ( $this->actions as $hook ) {
			add_action( $hook['hook'], array( $hook['component'], $hook['callback'] ), $hook['priority'], $hook['accepted_args'] );
		}
	}
}
