/**
 * Admin JavaScript for WP Chart SIP
 */

(function($) {
	'use strict';

	$(document).ready(function() {
		// Chart preview functionality
		$('#wcsp_preview_chart').on('click', function(e) {
			e.preventDefault();
			previewChart();
		});

		// Chart insert modal functionality
		$('.wcsp-insert-chart-button').on('click', function(e) {
			e.preventDefault();
			showChartSelectionModal();
		});

		// Auto-format JSON on blur
		$('#wcsp_chart_data, #wcsp_chart_options').on('blur', function() {
			try {
				var jsonText = $(this).val().trim();
				if (jsonText) {
					var formatted = JSON.stringify(JSON.parse(jsonText), null, 2);
					$(this).val(formatted);
				}
			} catch (e) {
				// Invalid JSON, don't format
			}
		});
	});

	/**
	 * Preview chart in admin
	 */
	function previewChart() {
		var chartType = $('#wcsp_chart_type').val();
		var chartData = $('#wcsp_chart_data').val();
		var chartOptions = $('#wcsp_chart_options').val();

		// Validate inputs
		if (!chartType) {
			alert('Please select a chart type.');
			return;
		}

		if (!chartData) {
			alert('Please enter chart data.');
			return;
		}

		// Parse JSON
		var data, options;
		try {
			data = JSON.parse(chartData);
		} catch (e) {
			alert('Invalid JSON in chart data: ' + e.message);
			return;
		}

		if (chartOptions) {
			try {
				options = JSON.parse(chartOptions);
			} catch (e) {
				alert('Invalid JSON in chart options: ' + e.message);
				return;
			}
		} else {
			options = {};
		}

		// Build chart configuration
		var config = {
			chart: {
				type: chartType,
				height: 350
			}
		};

		// Merge data
		if (data.series) {
			config.series = data.series;
		}
		if (data.categories) {
			config.xaxis = { categories: data.categories };
		}
		if (data.labels) {
			config.labels = data.labels;
		}

		// Merge custom options
		config = mergeDeep(config, options);

		// Show preview container
		$('#wcsp_chart_preview').show();

		// Clear previous chart
		$('#wcsp_preview_container').empty();

		// Render chart
		if (typeof ApexCharts !== 'undefined') {
			var chart = new ApexCharts(document.querySelector("#wcsp_preview_container"), config);
			chart.render();
		} else {
			$('#wcsp_preview_container').html('<p>ApexCharts library not loaded. Please refresh the page.</p>');
		}
	}

	/**
	 * Show chart selection modal
	 */
	function showChartSelectionModal() {
		if (!window.wcspCharts || !window.wcspCharts.charts) {
			alert('No charts available.');
			return;
		}

		// Create modal if it doesn't exist
		if ($('#wcsp-chart-modal').length === 0) {
			createChartModal();
		}

		// Show modal
		$('#wcsp-chart-modal-backdrop').addClass('active');
	}

	/**
	 * Create chart selection modal
	 */
	function createChartModal() {
		var charts = window.wcspCharts.charts;
		var labels = window.wcspCharts.labels;

		var modalHTML = '<div id="wcsp-chart-modal-backdrop" class="wcsp-modal-backdrop">' +
			'<div class="wcsp-modal">' +
			'<div class="wcsp-modal-header">' +
			'<h2>' + labels.modalTitle + '</h2>' +
			'</div>' +
			'<div class="wcsp-modal-body">';

		if (charts.length === 0) {
			modalHTML += '<div class="wcsp-no-charts">' + labels.noCharts + '</div>';
		} else {
			modalHTML += '<ul class="wcsp-chart-list">';
			charts.forEach(function(chart) {
				modalHTML += '<li class="wcsp-chart-item" data-chart-id="' + chart.ID + '">' +
					'<div class="wcsp-chart-item-title">' + chart.post_title + '</div>' +
					'<div class="wcsp-chart-item-id">ID: ' + chart.ID + '</div>' +
					'</li>';
			});
			modalHTML += '</ul>';
		}

		modalHTML += '</div>' +
			'<div class="wcsp-modal-footer">' +
			'<button type="button" class="button" id="wcsp-modal-cancel">' + labels.cancelButton + '</button> ' +
			'<button type="button" class="button button-primary" id="wcsp-modal-insert">' + labels.insertButton + '</button>' +
			'</div>' +
			'</div>' +
			'</div>';

		$('body').append(modalHTML);

		// Event handlers
		$('#wcsp-modal-backdrop').on('click', function(e) {
			if (e.target === this) {
				$(this).removeClass('active');
			}
		});

		$('#wcsp-modal-cancel').on('click', function() {
			$('#wcsp-chart-modal-backdrop').removeClass('active');
		});

		$('.wcsp-chart-item').on('click', function() {
			$('.wcsp-chart-item').removeClass('selected');
			$(this).addClass('selected');
		});

		$('#wcsp-modal-insert').on('click', function() {
			var selectedId = $('.wcsp-chart-item.selected').data('chart-id');
			if (!selectedId) {
				alert('Please select a chart.');
				return;
			}

			// Insert shortcode
			var shortcode = '[wcsp_chart id="' + selectedId + '"]';

			// Insert into editor
			if (typeof wp !== 'undefined' && wp.media && wp.media.editor) {
				wp.media.editor.insert(shortcode);
			} else {
				// Fallback for classic editor
				var editor = $('#content');
				if (editor.length) {
					editor.val(editor.val() + shortcode);
				}
			}

			// Close modal
			$('#wcsp-chart-modal-backdrop').removeClass('active');
		});
	}

	/**
	 * Deep merge objects
	 */
	function mergeDeep(target, source) {
		const output = Object.assign({}, target);
		if (isObject(target) && isObject(source)) {
			Object.keys(source).forEach(key => {
				if (isObject(source[key])) {
					if (!(key in target)) {
						Object.assign(output, { [key]: source[key] });
					} else {
						output[key] = mergeDeep(target[key], source[key]);
					}
				} else {
					Object.assign(output, { [key]: source[key] });
				}
			});
		}
		return output;
	}

	/**
	 * Check if value is an object
	 */
	function isObject(item) {
		return item && typeof item === 'object' && !Array.isArray(item);
	}

})(jQuery);
