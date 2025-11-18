<?php
/**
 * Chart meta box view.
 *
 * @package    WP_Chart_SIP
 * @subpackage WP_Chart_SIP/admin/views
 */

// If this file is called directly, abort.
if ( ! defined( 'WPINC' ) ) {
	die;
}
?>

<div class="wcsp-meta-box">
	<div class="wcsp-field">
		<label for="wcsp_chart_type">
			<strong><?php esc_html_e( 'Chart Type:', 'wp-chart-sip' ); ?></strong>
		</label>
		<select id="wcsp_chart_type" name="wcsp_chart_type" class="widefat" required>
			<option value=""><?php esc_html_e( 'Select Chart Type', 'wp-chart-sip' ); ?></option>
			<?php foreach ( $chart_types as $type => $label ) : ?>
				<option value="<?php echo esc_attr( $type ); ?>" <?php selected( $chart_type, $type ); ?>>
					<?php echo esc_html( $label ); ?>
				</option>
			<?php endforeach; ?>
		</select>
		<p class="description"><?php esc_html_e( 'Select the type of chart you want to create.', 'wp-chart-sip' ); ?></p>
	</div>

	<div class="wcsp-field">
		<label for="wcsp_chart_data">
			<strong><?php esc_html_e( 'Chart Data (JSON):', 'wp-chart-sip' ); ?></strong>
		</label>
		<textarea id="wcsp_chart_data" name="wcsp_chart_data" rows="10" class="widefat code" required><?php echo esc_textarea( $chart_data ); ?></textarea>
		<p class="description">
			<?php esc_html_e( 'Enter chart data in JSON format. Example:', 'wp-chart-sip' ); ?>
			<br>
			<code>{
  "series": [{
    "name": "Sales",
    "data": [30, 40, 35, 50, 49, 60, 70, 91, 125]
  }],
  "categories": ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep"]
}</code>
		</p>
	</div>

	<div class="wcsp-field">
		<label for="wcsp_chart_options">
			<strong><?php esc_html_e( 'Chart Options (JSON - Optional):', 'wp-chart-sip' ); ?></strong>
		</label>
		<textarea id="wcsp_chart_options" name="wcsp_chart_options" rows="10" class="widefat code"><?php echo esc_textarea( $chart_options ); ?></textarea>
		<p class="description">
			<?php esc_html_e( 'Customize chart appearance with ApexCharts options. Example:', 'wp-chart-sip' ); ?>
			<br>
			<code>{
  "colors": ["#008FFB"],
  "title": {
    "text": "Monthly Sales",
    "align": "left"
  }
}</code>
		</p>
	</div>

	<div class="wcsp-field">
		<button type="button" id="wcsp_preview_chart" class="button button-secondary">
			<?php esc_html_e( 'Preview Chart', 'wp-chart-sip' ); ?>
		</button>
	</div>

	<div id="wcsp_chart_preview" style="margin-top: 20px; display: none;">
		<h3><?php esc_html_e( 'Chart Preview:', 'wp-chart-sip' ); ?></h3>
		<div id="wcsp_preview_container"></div>
	</div>
</div>
