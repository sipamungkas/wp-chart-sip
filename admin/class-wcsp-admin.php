<?php
/**
 * The admin-specific functionality of the plugin.
 *
 * @package    WP_Chart_SIP
 * @subpackage WP_Chart_SIP/admin
 */

class WCSP_Admin {

	/**
	 * Add meta boxes for chart post type.
	 */
	public function add_meta_boxes() {
		add_meta_box(
			'wcsp_chart_data',
			__( 'Chart Configuration', 'wp-chart-sip' ),
			array( $this, 'render_chart_meta_box' ),
			'wcsp_chart',
			'normal',
			'high'
		);

		add_meta_box(
			'wcsp_chart_shortcode',
			__( 'Shortcode', 'wp-chart-sip' ),
			array( $this, 'render_shortcode_meta_box' ),
			'wcsp_chart',
			'side',
			'default'
		);
	}

	/**
	 * Render the chart configuration meta box.
	 *
	 * @param WP_Post $post The post object.
	 */
	public function render_chart_meta_box( $post ) {
		// Add nonce for security
		wp_nonce_field( 'wcsp_save_chart_data', 'wcsp_chart_nonce' );

		// Get existing values
		$chart_type = get_post_meta( $post->ID, '_wcsp_chart_type', true );
		$chart_data = get_post_meta( $post->ID, '_wcsp_chart_data', true );
		$chart_options = get_post_meta( $post->ID, '_wcsp_chart_options', true );

		// Get chart types
		$chart_types = WCSP_Chart::get_chart_types();

		// Include the view
		include WCSP_PLUGIN_DIR . 'admin/views/chart-meta-box.php';
	}

	/**
	 * Render the shortcode meta box.
	 *
	 * @param WP_Post $post The post object.
	 */
	public function render_shortcode_meta_box( $post ) {
		if ( $post->post_status === 'publish' ) {
			echo '<p>' . esc_html__( 'Use this shortcode to display the chart:', 'wp-chart-sip' ) . '</p>';
			echo '<input type="text" readonly value="[wcsp_chart id=&quot;' . esc_attr( $post->ID ) . '&quot;]" class="widefat" onclick="this.select();" />';
			echo '<p class="description">' . esc_html__( 'Click to select and copy the shortcode.', 'wp-chart-sip' ) . '</p>';
		} else {
			echo '<p>' . esc_html__( 'Publish the chart to get the shortcode.', 'wp-chart-sip' ) . '</p>';
		}
	}

	/**
	 * Save chart data.
	 *
	 * @param int     $post_id The post ID.
	 * @param WP_Post $post    The post object.
	 */
	public function save_chart_data( $post_id, $post ) {
		// Check nonce
		if ( ! isset( $_POST['wcsp_chart_nonce'] ) || ! wp_verify_nonce( $_POST['wcsp_chart_nonce'], 'wcsp_save_chart_data' ) ) {
			return;
		}

		// Check autosave
		if ( defined( 'DOING_AUTOSAVE' ) && DOING_AUTOSAVE ) {
			return;
		}

		// Check permissions
		if ( ! current_user_can( 'edit_post', $post_id ) ) {
			return;
		}

		// Save chart type
		if ( isset( $_POST['wcsp_chart_type'] ) ) {
			update_post_meta( $post_id, '_wcsp_chart_type', sanitize_text_field( $_POST['wcsp_chart_type'] ) );
		}

		// Save chart data (JSON)
		if ( isset( $_POST['wcsp_chart_data'] ) ) {
			$chart_data = wp_unslash( $_POST['wcsp_chart_data'] );
			// Validate JSON
			$decoded = json_decode( $chart_data, true );
			if ( json_last_error() === JSON_ERROR_NONE ) {
				update_post_meta( $post_id, '_wcsp_chart_data', $chart_data );
			}
		}

		// Save chart options (JSON)
		if ( isset( $_POST['wcsp_chart_options'] ) ) {
			$chart_options = wp_unslash( $_POST['wcsp_chart_options'] );
			// Validate JSON
			$decoded = json_decode( $chart_options, true );
			if ( json_last_error() === JSON_ERROR_NONE ) {
				update_post_meta( $post_id, '_wcsp_chart_options', $chart_options );
			}
		}
	}

	/**
	 * Add chart insert button to post editor.
	 */
	public function add_chart_button() {
		global $post_type;

		// Only show on post and page edit screens
		if ( ! in_array( $post_type, array( 'post', 'page' ) ) ) {
			return;
		}

		echo '<button type="button" class="button wcsp-insert-chart-button" data-editor="content">';
		echo '<span class="dashicons dashicons-chart-bar" style="vertical-align: middle;"></span> ';
		echo esc_html__( 'Insert Chart', 'wp-chart-sip' );
		echo '</button>';
	}

	/**
	 * Enqueue admin styles.
	 *
	 * @param string $hook The current admin page.
	 */
	public function enqueue_styles( $hook ) {
		if ( in_array( $hook, array( 'post.php', 'post-new.php' ) ) ) {
			wp_enqueue_style(
				'wcsp-admin',
				WCSP_PLUGIN_URL . 'admin/css/wcsp-admin.css',
				array(),
				WCSP_VERSION
			);
		}
	}

	/**
	 * Enqueue admin scripts.
	 *
	 * @param string $hook The current admin page.
	 */
	public function enqueue_scripts( $hook ) {
		global $post_type;

		if ( in_array( $hook, array( 'post.php', 'post-new.php' ) ) ) {
			// Enqueue on chart edit screen
			if ( $post_type === 'wcsp_chart' ) {
				wp_enqueue_script(
					'wcsp-admin',
					WCSP_PLUGIN_URL . 'admin/js/wcsp-admin.js',
					array( 'jquery' ),
					WCSP_VERSION,
					true
				);

				// Add ApexCharts for preview
				wp_enqueue_script(
					'apexcharts',
					'https://cdn.jsdelivr.net/npm/apexcharts@3.45.1/dist/apexcharts.min.js',
					array(),
					'3.45.1',
					true
				);

				wp_localize_script(
					'wcsp-admin',
					'wcspAdmin',
					array(
						'ajaxUrl' => admin_url( 'admin-ajax.php' ),
						'nonce'   => wp_create_nonce( 'wcsp_admin_nonce' ),
					)
				);
			}

			// Enqueue chart selector modal on post/page edit screens
			if ( in_array( $post_type, array( 'post', 'page' ) ) ) {
				wp_enqueue_script(
					'wcsp-chart-selector',
					WCSP_PLUGIN_URL . 'admin/js/wcsp-admin.js',
					array( 'jquery' ),
					WCSP_VERSION,
					true
				);

				// Get all published charts for the modal
				$charts = get_posts( array(
					'post_type'      => 'wcsp_chart',
					'posts_per_page' => -1,
					'post_status'    => 'publish',
					'orderby'        => 'title',
					'order'          => 'ASC',
				) );

				wp_localize_script(
					'wcsp-chart-selector',
					'wcspCharts',
					array(
						'charts' => $charts,
						'labels' => array(
							'modalTitle'   => __( 'Select a Chart', 'wp-chart-sip' ),
							'insertButton' => __( 'Insert Chart', 'wp-chart-sip' ),
							'cancelButton' => __( 'Cancel', 'wp-chart-sip' ),
							'noCharts'     => __( 'No charts found. Please create a chart first.', 'wp-chart-sip' ),
						),
					)
				);
			}
		}
	}
}
