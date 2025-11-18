<?php
/**
 * The public-facing functionality of the plugin.
 *
 * @package    WP_Chart_SIP
 * @subpackage WP_Chart_SIP/public
 */

class WCSP_Public {

	/**
	 * Register the shortcode.
	 */
	public function register_shortcode() {
		add_shortcode( 'wcsp_chart', array( $this, 'render_chart_shortcode' ) );
	}

	/**
	 * Render the chart shortcode.
	 *
	 * @param array $atts Shortcode attributes.
	 * @return string Chart HTML.
	 */
	public function render_chart_shortcode( $atts ) {
		$atts = shortcode_atts(
			array(
				'id'     => '',
				'width'  => '100%',
				'height' => '350',
			),
			$atts,
			'wcsp_chart'
		);

		if ( empty( $atts['id'] ) ) {
			return '<p class="wcsp-error">' . esc_html__( 'Chart ID is required.', 'wp-chart-sip' ) . '</p>';
		}

		$post_id = intval( $atts['id'] );

		// Check if post exists and is published
		$post = get_post( $post_id );
		if ( ! $post || $post->post_type !== 'wcsp_chart' || $post->post_status !== 'publish' ) {
			return '<p class="wcsp-error">' . esc_html__( 'Chart not found.', 'wp-chart-sip' ) . '</p>';
		}

		// Get chart data
		$chart_data = WCSP_Chart::get_chart_data( $post_id );
		if ( ! $chart_data ) {
			return '<p class="wcsp-error">' . esc_html__( 'Chart data is missing or invalid.', 'wp-chart-sip' ) . '</p>';
		}

		// Generate unique ID for this chart instance
		$chart_id = 'wcsp-chart-' . $post_id . '-' . wp_rand();

		// Prepare chart configuration
		$config = array(
			'chart' => array(
				'type'   => $chart_data['type'],
				'height' => intval( $atts['height'] ),
				'width'  => $atts['width'],
			),
		);

		// Parse chart data
		$data = json_decode( $chart_data['data'], true );
		if ( json_last_error() !== JSON_ERROR_NONE ) {
			return '<p class="wcsp-error">' . esc_html__( 'Invalid chart data format.', 'wp-chart-sip' ) . '</p>';
		}

		// Merge data into config
		if ( isset( $data['series'] ) ) {
			$config['series'] = $data['series'];
		}
		if ( isset( $data['categories'] ) ) {
			$config['xaxis'] = array( 'categories' => $data['categories'] );
		}
		if ( isset( $data['labels'] ) ) {
			$config['labels'] = $data['labels'];
		}

		// Merge custom options
		if ( ! empty( $chart_data['options'] ) ) {
			$options = json_decode( $chart_data['options'], true );
			if ( json_last_error() === JSON_ERROR_NONE && is_array( $options ) ) {
				$config = array_merge_recursive( $config, $options );
			}
		}

		// Enqueue scripts
		$this->enqueue_chart_scripts();

		// Output chart container and initialization script
		ob_start();
		?>
		<div class="wcsp-chart-wrapper">
			<div id="<?php echo esc_attr( $chart_id ); ?>" class="wcsp-chart"></div>
		</div>
		<script type="text/javascript">
			(function() {
				function initChart() {
					if (typeof ApexCharts === 'undefined') {
						setTimeout(initChart, 100);
						return;
					}
					var options = <?php echo wp_json_encode( $config ); ?>;
					var chart = new ApexCharts(document.querySelector("#<?php echo esc_js( $chart_id ); ?>"), options);
					chart.render();
				}
				if (document.readyState === 'loading') {
					document.addEventListener('DOMContentLoaded', initChart);
				} else {
					initChart();
				}
			})();
		</script>
		<?php
		return ob_get_clean();
	}

	/**
	 * Enqueue ApexCharts library.
	 */
	private function enqueue_chart_scripts() {
		static $enqueued = false;

		if ( ! $enqueued ) {
			wp_enqueue_script(
				'apexcharts',
				'https://cdn.jsdelivr.net/npm/apexcharts@3.45.1/dist/apexcharts.min.js',
				array(),
				'3.45.1',
				true
			);
			$enqueued = true;
		}
	}

	/**
	 * Enqueue public styles.
	 */
	public function enqueue_styles() {
		wp_enqueue_style(
			'wcsp-public',
			WCSP_PLUGIN_URL . 'public/css/wcsp-public.css',
			array(),
			WCSP_VERSION
		);
	}

	/**
	 * Enqueue public scripts.
	 */
	public function enqueue_scripts() {
		wp_enqueue_script(
			'wcsp-public',
			WCSP_PLUGIN_URL . 'public/js/wcsp-public.js',
			array( 'jquery' ),
			WCSP_VERSION,
			true
		);
	}
}
