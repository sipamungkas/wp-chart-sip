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
	<!-- Chart Type Selection (Always Visible) -->
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

	<!-- Tab Navigation -->
	<div class="wcsp-tabs">
		<button type="button" class="wcsp-tab-button active" data-tab="gui">
			<span class="dashicons dashicons-forms"></span>
			<?php esc_html_e( 'Simple Mode', 'wp-chart-sip' ); ?>
		</button>
		<button type="button" class="wcsp-tab-button" data-tab="json">
			<span class="dashicons dashicons-editor-code"></span>
			<?php esc_html_e( 'JSON Mode', 'wp-chart-sip' ); ?>
		</button>
	</div>

	<!-- GUI Mode (Simple Form) -->
	<div id="wcsp-tab-gui" class="wcsp-tab-content active">
		<div class="wcsp-gui-section">
			<h4><?php esc_html_e( 'Chart Data', 'wp-chart-sip' ); ?></h4>
			<p class="description"><?php esc_html_e( 'Add your data series and labels below. No coding required!', 'wp-chart-sip' ); ?></p>

			<!-- Data Series -->
			<div class="wcsp-field">
				<label><strong><?php esc_html_e( 'Data Series:', 'wp-chart-sip' ); ?></strong></label>
				<div id="wcsp-series-container">
					<!-- Series will be added here by JavaScript -->
				</div>
				<button type="button" id="wcsp-add-series" class="button">
					<span class="dashicons dashicons-plus-alt"></span>
					<?php esc_html_e( 'Add Series', 'wp-chart-sip' ); ?>
				</button>
			</div>

			<!-- Categories/Labels -->
			<div class="wcsp-field">
				<label for="wcsp-gui-categories">
					<strong><?php esc_html_e( 'Labels (Categories):', 'wp-chart-sip' ); ?></strong>
				</label>
				<input type="text" id="wcsp-gui-categories" class="widefat" placeholder="Jan, Feb, Mar, Apr, May, Jun">
				<p class="description"><?php esc_html_e( 'Enter labels separated by commas (for line, bar, area charts) or leave empty for pie/donut charts.', 'wp-chart-sip' ); ?></p>
			</div>
		</div>

		<div class="wcsp-gui-section">
			<h4><?php esc_html_e( 'Chart Styling', 'wp-chart-sip' ); ?></h4>

			<!-- Chart Title -->
			<div class="wcsp-field">
				<label for="wcsp-gui-title">
					<strong><?php esc_html_e( 'Chart Title:', 'wp-chart-sip' ); ?></strong>
				</label>
				<input type="text" id="wcsp-gui-title" class="widefat" placeholder="My Chart Title">
			</div>

			<!-- Colors -->
			<div class="wcsp-field">
				<label for="wcsp-gui-colors">
					<strong><?php esc_html_e( 'Colors:', 'wp-chart-sip' ); ?></strong>
				</label>
				<input type="text" id="wcsp-gui-colors" class="widefat" placeholder="#008FFB, #00E396, #FEB019">
				<p class="description"><?php esc_html_e( 'Enter colors separated by commas (hex codes or color names).', 'wp-chart-sip' ); ?></p>
			</div>

			<!-- Chart Height -->
			<div class="wcsp-field">
				<label for="wcsp-gui-height">
					<strong><?php esc_html_e( 'Chart Height:', 'wp-chart-sip' ); ?></strong>
				</label>
				<input type="number" id="wcsp-gui-height" class="small-text" value="350" min="200" max="1000">
				<span>px</span>
			</div>
		</div>
	</div>

	<!-- JSON Mode (Advanced) -->
	<div id="wcsp-tab-json" class="wcsp-tab-content">
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
	</div>

	<!-- Preview Button -->
	<div class="wcsp-field" style="margin-top: 20px;">
		<button type="button" id="wcsp_preview_chart" class="button button-secondary button-large">
			<span class="dashicons dashicons-visibility"></span>
			<?php esc_html_e( 'Preview Chart', 'wp-chart-sip' ); ?>
		</button>
	</div>

	<!-- Preview Container -->
	<div id="wcsp_chart_preview" style="margin-top: 20px; display: none;">
		<h3><?php esc_html_e( 'Chart Preview:', 'wp-chart-sip' ); ?></h3>
		<div id="wcsp_preview_container"></div>
	</div>
</div>
