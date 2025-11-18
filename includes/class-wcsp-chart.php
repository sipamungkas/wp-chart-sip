<?php
/**
 * Chart custom post type and data handling.
 *
 * @package    WP_Chart_SIP
 * @subpackage WP_Chart_SIP/includes
 */

class WCSP_Chart {

	/**
	 * Register the chart custom post type.
	 */
	public function register_post_type() {
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
			'menu_name'          => __( 'Charts', 'wp-chart-sip' ),
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

	/**
	 * Get chart data by post ID.
	 *
	 * @param int $post_id The chart post ID.
	 * @return array|false Chart data or false if not found.
	 */
	public static function get_chart_data( $post_id ) {
		$chart_type = get_post_meta( $post_id, '_wcsp_chart_type', true );
		$chart_data = get_post_meta( $post_id, '_wcsp_chart_data', true );
		$chart_options = get_post_meta( $post_id, '_wcsp_chart_options', true );

		if ( empty( $chart_type ) || empty( $chart_data ) ) {
			return false;
		}

		return array(
			'type'    => $chart_type,
			'data'    => $chart_data,
			'options' => $chart_options ? $chart_options : array(),
		);
	}

	/**
	 * Get available chart types.
	 *
	 * @return array Chart types.
	 */
	public static function get_chart_types() {
		return array(
			'line'      => __( 'Line Chart', 'wp-chart-sip' ),
			'bar'       => __( 'Bar Chart', 'wp-chart-sip' ),
			'pie'       => __( 'Pie Chart', 'wp-chart-sip' ),
			'donut'     => __( 'Donut Chart', 'wp-chart-sip' ),
			'area'      => __( 'Area Chart', 'wp-chart-sip' ),
			'radar'     => __( 'Radar Chart', 'wp-chart-sip' ),
			'scatter'   => __( 'Scatter Chart', 'wp-chart-sip' ),
			'heatmap'   => __( 'Heatmap', 'wp-chart-sip' ),
		);
	}
}
