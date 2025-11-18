/**
 * Admin JavaScript for WP Chart SIP
 */

(function($) {
	'use strict';

	// Store chart instance globally to manage it properly
	var chartInstance = null;

	// Debounce timers for sync operations
	var guiToJsonTimer = null;
	var jsonToGuiTimer = null;

	$(document).ready(function() {
		// Chart preview functionality
		$('#wcsp_preview_chart').on('click', function(e) {
			e.preventDefault();
			// Convert GUI to JSON first if in GUI mode
			if ($('#wcsp-tab-gui').hasClass('active')) {
				convertGuiToJson();
			}
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

		// Real-time JSON → GUI sync (debounced)
		$('#wcsp_chart_data, #wcsp_chart_options').on('input', function() {
			// Only sync to GUI if JSON tab is active
			if ($('#wcsp-tab-json').hasClass('active')) {
				debouncedLoadJsonToGui();
			}
		});

		// Chart type change handler - trigger immediate sync
		$('#wcsp_chart_type').on('change', function() {
			handleChartTypeChange();
		});

		// Tab switching functionality with bidirectional sync
		$('.wcsp-tab-button').on('click', function() {
			var currentTab = $('.wcsp-tab-button.active').data('tab');
			var newTab = $(this).data('tab');

			// Don't do anything if clicking the same tab
			if (currentTab === newTab) {
				return;
			}

			// Sync data when switching tabs
			if (currentTab === 'gui' && newTab === 'json') {
				// Switching from GUI to JSON - convert GUI to JSON
				convertGuiToJson();
			} else if (currentTab === 'json' && newTab === 'gui') {
				// Switching from JSON to GUI - load JSON into GUI
				loadJsonToGui();
			}

			// Update active states
			$('.wcsp-tab-button').removeClass('active');
			$(this).addClass('active');
			$('.wcsp-tab-content').removeClass('active');
			$('#wcsp-tab-' + newTab).addClass('active');
		});

		// Add series button
		$('#wcsp-add-series').on('click', function() {
			addSeriesRow();
		});

		// Initialize GUI with existing data or empty state
		initializeGuiMode();

		// Real-time GUI → JSON sync (debounced) - Use event delegation
		$('#wcsp-series-container').on('input change', '.wcsp-series-name, .wcsp-series-data', function() {
			if ($('#wcsp-tab-gui').hasClass('active')) {
				debouncedConvertGuiToJson();
			}
		});
		$('#wcsp-gui-categories, #wcsp-gui-title, #wcsp-gui-colors, #wcsp-gui-height').on('input change', function() {
			if ($('#wcsp-tab-gui').hasClass('active')) {
				debouncedConvertGuiToJson();
			}
		});

		// Convert GUI to JSON before saving (always sync regardless of active tab)
		$('form#post').on('submit', function() {
			// Always convert GUI to JSON to ensure JSON fields have latest data
			if ($('#wcsp-series-container').children().length > 0) {
				convertGuiToJson();
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

		// Show preview container
		$('#wcsp_chart_preview').show();

		// Show loading state
		$('#wcsp_preview_container').html('<div class="wcsp-loading"><span class="spinner is-active"></span> Loading chart...</div>');

		// Validate inputs
		if (!chartType) {
			$('#wcsp_preview_container').html('<div class="notice notice-error inline"><p>Please select a chart type.</p></div>');
			return;
		}

		if (!chartData) {
			$('#wcsp_preview_container').html('<div class="notice notice-error inline"><p>Please enter chart data.</p></div>');
			return;
		}

		// Parse JSON
		var data, options;
		try {
			data = JSON.parse(chartData);
		} catch (e) {
			$('#wcsp_preview_container').html('<div class="notice notice-error inline"><p><strong>Invalid JSON in chart data:</strong> ' + e.message + '</p></div>');
			return;
		}

		if (chartOptions) {
			try {
				options = JSON.parse(chartOptions);
			} catch (e) {
				$('#wcsp_preview_container').html('<div class="notice notice-error inline"><p><strong>Invalid JSON in chart options:</strong> ' + e.message + '</p></div>');
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

		// Destroy previous chart instance if exists
		if (chartInstance !== null) {
			try {
				chartInstance.destroy();
				chartInstance = null;
			} catch (e) {
				console.error('Error destroying chart instance:', e);
			}
		}

		// Clear container
		$('#wcsp_preview_container').empty();

		// Render chart with error handling
		try {
			if (typeof ApexCharts !== 'undefined') {
				chartInstance = new ApexCharts(document.querySelector("#wcsp_preview_container"), config);
				chartInstance.render().catch(function(error) {
					console.error('Chart rendering error:', error);
					$('#wcsp_preview_container').html('<div class="notice notice-error inline"><p><strong>Error rendering chart:</strong> ' + error.message + '</p></div>');
					chartInstance = null;
				});
			} else {
				$('#wcsp_preview_container').html('<div class="notice notice-error inline"><p>ApexCharts library not loaded. Please refresh the page.</p></div>');
			}
		} catch (e) {
			console.error('Chart initialization error:', e);
			$('#wcsp_preview_container').html('<div class="notice notice-error inline"><p><strong>Error initializing chart:</strong> ' + e.message + '</p></div>');
			chartInstance = null;
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

	/**
	 * Add a new series row in GUI mode
	 */
	var seriesCounter = 0;
	function addSeriesRow(name, data) {
		seriesCounter++;
		// Use timestamp-based unique index to avoid conflicts
		var uniqueIndex = 'series_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
		name = name || 'Series ' + seriesCounter;
		data = data || '';

		var html = '<div class="wcsp-series-row" data-index="' + uniqueIndex + '">' +
			'<div class="wcsp-series-fields">' +
			'<div class="wcsp-series-field">' +
			'<label>Series Name:</label>' +
			'<input type="text" class="wcsp-series-name" value="' + escapeHtml(name) + '" placeholder="e.g., Sales">' +
			'</div>' +
			'<div class="wcsp-series-field wcsp-series-data-field">' +
			'<label>Data Values:</label>' +
			'<input type="text" class="wcsp-series-data" value="' + escapeHtml(data) + '" placeholder="e.g., 30, 40, 35, 50, 49, 60">' +
			'</div>' +
			'<button type="button" class="button wcsp-remove-series" title="Remove Series">' +
			'<span class="dashicons dashicons-no-alt"></span>' +
			'</button>' +
			'</div>' +
			'</div>';

		$('#wcsp-series-container').append(html);

		// Bind remove event
		$('.wcsp-remove-series').off('click').on('click', function() {
			if ($('.wcsp-series-row').length > 1) {
				$(this).closest('.wcsp-series-row').remove();
				// Trigger sync after removal
				if ($('#wcsp-tab-gui').hasClass('active')) {
					debouncedConvertGuiToJson();
				}
			} else {
				alert('You must have at least one data series.');
			}
		});
	}

	/**
	 * Convert GUI inputs to JSON format
	 */
	function convertGuiToJson() {
		var chartType = $('#wcsp_chart_type').val();
		var series = [];
		var categories = [];
		var labels = [];

		// Clear previous validation errors
		clearValidationErrors();

		// Get series data
		if (chartType === 'pie' || chartType === 'donut') {
			// For pie/donut charts, series is a flat array of numbers
			var allDataValues = [];
			$('.wcsp-series-row').each(function() {
				var $dataField = $(this).find('.wcsp-series-data');
				var dataStr = $dataField.val().trim();
				if (dataStr) {
					// Validate data
					validateNumericData(dataStr, $dataField);

					// Parse data values and add to flat array
					var dataValues = dataStr.split(',').map(function(v) {
						var num = parseFloat(v.trim());
						return isNaN(num) ? 0 : num;
					});
					allDataValues = allDataValues.concat(dataValues);
				}
			});
			series = allDataValues;
		} else {
			// For other charts, series is an array of objects with name and data
			$('.wcsp-series-row').each(function() {
				var name = $(this).find('.wcsp-series-name').val().trim();
				var $dataField = $(this).find('.wcsp-series-data');
				var dataStr = $dataField.val().trim();

				if (dataStr) {
					// Validate data
					validateNumericData(dataStr, $dataField);

					// Parse data values
					var dataValues = dataStr.split(',').map(function(v) {
						var num = parseFloat(v.trim());
						return isNaN(num) ? 0 : num;
					});

					series.push({
						name: name || 'Series',
						data: dataValues
					});
				}
			});
		}

		// Get categories/labels
		var categoriesStr = $('#wcsp-gui-categories').val().trim();
		if (categoriesStr) {
			if (chartType === 'pie' || chartType === 'donut') {
				labels = categoriesStr.split(',').map(function(v) { return v.trim(); });
			} else {
				categories = categoriesStr.split(',').map(function(v) { return v.trim(); });
			}
		}

		// Build data object
		var chartData = { series: series };
		if (categories.length > 0) {
			chartData.categories = categories;
		}
		if (labels.length > 0) {
			chartData.labels = labels;
		}

		// Get styling options
		var options = {};
		var title = $('#wcsp-gui-title').val().trim();
		var colorsStr = $('#wcsp-gui-colors').val().trim();
		var height = $('#wcsp-gui-height').val();

		if (title) {
			options.title = {
				text: title,
				align: 'left'
			};
		}

		if (colorsStr) {
			options.colors = colorsStr.split(',').map(function(v) { return v.trim(); });
		}

		if (height && height != 350) {
			if (!options.chart) options.chart = {};
			options.chart.height = parseInt(height);
		}

		// Update JSON fields
		$('#wcsp_chart_data').val(JSON.stringify(chartData, null, 2));
		$('#wcsp_chart_options').val(JSON.stringify(options, null, 2));
	}

	/**
	 * Load existing JSON data into GUI fields
	 */
	function loadJsonToGui() {
		try {
			var chartData = $('#wcsp_chart_data').val().trim();
			var chartOptions = $('#wcsp_chart_options').val().trim();

			if (!chartData) {
				// No data, ensure at least one series row exists
				if ($('#wcsp-series-container').children().length === 0) {
					addSeriesRow();
				}
				return;
			}

			var data = JSON.parse(chartData);
			var options = chartOptions ? JSON.parse(chartOptions) : {};
			var chartType = $('#wcsp_chart_type').val();

			// Validate data structure
			if (!data.series) {
				console.warn('Invalid chart data: missing series');
				if ($('#wcsp-series-container').children().length === 0) {
					addSeriesRow();
				}
				return;
			}

			// Clear existing series
			$('#wcsp-series-container').empty();
			// Note: seriesCounter is NOT reset - we use timestamp-based indices now

			// Load series
			if (data.series && data.series.length > 0) {
				if (chartType === 'pie' || chartType === 'donut') {
					// For pie/donut, series is a flat array of numbers
					// data.series = [44, 55, 13, 33]
					if (Array.isArray(data.series) && typeof data.series[0] === 'number') {
						addSeriesRow('Values', data.series.join(', '));
					} else {
						// Fallback for unexpected format
						console.warn('Unexpected series format for pie/donut chart');
						addSeriesRow('Values', '');
					}
				} else {
					// For other charts, series is an array of objects with name and data
					if (Array.isArray(data.series)) {
						data.series.forEach(function(seriesItem) {
							if (seriesItem && typeof seriesItem === 'object') {
								var name = seriesItem.name || 'Series';
								var dataStr = Array.isArray(seriesItem.data) ? seriesItem.data.join(', ') : '';
								addSeriesRow(name, dataStr);
							}
						});
					}
				}
			}

			// Ensure at least one series row exists
			if ($('#wcsp-series-container').children().length === 0) {
				addSeriesRow();
			}

			// Load categories or labels
			if (data.categories && Array.isArray(data.categories)) {
				$('#wcsp-gui-categories').val(data.categories.join(', '));
			} else if (data.labels && Array.isArray(data.labels)) {
				$('#wcsp-gui-categories').val(data.labels.join(', '));
			} else {
				$('#wcsp-gui-categories').val('');
			}

			// Load options
			if (options.title && options.title.text) {
				$('#wcsp-gui-title').val(options.title.text);
			} else {
				$('#wcsp-gui-title').val('');
			}

			if (options.colors && Array.isArray(options.colors) && options.colors.length > 0) {
				$('#wcsp-gui-colors').val(options.colors.join(', '));
			} else {
				$('#wcsp-gui-colors').val('');
			}

			if (options.chart && options.chart.height) {
				$('#wcsp-gui-height').val(options.chart.height);
			} else {
				$('#wcsp-gui-height').val('350');
			}
		} catch (e) {
			console.error('Could not load JSON to GUI:', e);
			// If JSON is invalid, just initialize with empty series
			if ($('#wcsp-series-container').children().length === 0) {
				addSeriesRow();
			}
		}
	}

	/**
	 * Initialize GUI mode on page load
	 */
	function initializeGuiMode() {
		// Check if we have existing JSON data
		var hasJsonData = $('#wcsp_chart_data').val().trim() !== '';

		if (hasJsonData) {
			// Load existing data into GUI
			loadJsonToGui();
		} else if ($('#wcsp-series-container').children().length === 0) {
			// No data and no series - add empty row
			addSeriesRow();
		}

		// Update UI based on current chart type
		updateSeriesControls();
		updateCategoriesLabel();
	}

	/**
	 * Debounced GUI to JSON conversion
	 */
	function debouncedConvertGuiToJson() {
		clearTimeout(guiToJsonTimer);
		guiToJsonTimer = setTimeout(function() {
			convertGuiToJson();
		}, 500);
	}

	/**
	 * Debounced JSON to GUI loading
	 */
	function debouncedLoadJsonToGui() {
		clearTimeout(jsonToGuiTimer);
		jsonToGuiTimer = setTimeout(function() {
			loadJsonToGui();
		}, 500);
	}

	/**
	 * Handle chart type change
	 */
	function handleChartTypeChange() {
		var newChartType = $('#wcsp_chart_type').val();
		var oldChartData = $('#wcsp_chart_data').val().trim();

		// Update UI controls and labels
		updateSeriesControls();
		updateCategoriesLabel();

		// If we have existing data, restructure it for the new chart type
		if (oldChartData) {
			try {
				var data = JSON.parse(oldChartData);
				var isPieOrDonut = (newChartType === 'pie' || newChartType === 'donut');
				var wasPieOrDonut = Array.isArray(data.series) && typeof data.series[0] === 'number';

				// Restructure if switching between pie/donut and other types
				if (isPieOrDonut && !wasPieOrDonut) {
					// Converting TO pie/donut from other chart type
					// Flatten all series data into one array
					var flatData = [];
					if (Array.isArray(data.series)) {
						data.series.forEach(function(series) {
							if (Array.isArray(series.data)) {
								flatData = flatData.concat(series.data);
							}
						});
					}
					data.series = flatData;

					// Convert categories to labels
					if (data.categories) {
						data.labels = data.categories;
						delete data.categories;
					}

					$('#wcsp_chart_data').val(JSON.stringify(data, null, 2));
				} else if (!isPieOrDonut && wasPieOrDonut) {
					// Converting FROM pie/donut to other chart type
					// Convert flat array to series with objects
					var seriesData = [];
					if (Array.isArray(data.series)) {
						seriesData.push({
							name: 'Series 1',
							data: data.series
						});
					}
					data.series = seriesData;

					// Convert labels to categories
					if (data.labels) {
						data.categories = data.labels;
						delete data.labels;
					}

					$('#wcsp_chart_data').val(JSON.stringify(data, null, 2));
				}

				// Reload GUI with restructured data
				loadJsonToGui();
			} catch (e) {
				console.log('Could not restructure data on chart type change:', e);
			}
		} else {
			// No existing data, just update the GUI structure
			loadJsonToGui();
		}
	}

	/**
	 * Update series controls based on chart type
	 */
	function updateSeriesControls() {
		var chartType = $('#wcsp_chart_type').val();
		var isPieOrDonut = (chartType === 'pie' || chartType === 'donut');
		var $addButton = $('#wcsp-add-series');

		if (isPieOrDonut) {
			// Disable add series button for pie/donut
			$addButton.prop('disabled', true);
			$addButton.attr('title', 'Pie and donut charts use a single data series');
			$addButton.addClass('wcsp-disabled');

			// Ensure only one series row exists
			if ($('.wcsp-series-row').length > 1) {
				// Merge all series data into first row
				var allData = [];
				$('.wcsp-series-row').each(function() {
					var dataStr = $(this).find('.wcsp-series-data').val().trim();
					if (dataStr) {
						var values = dataStr.split(',').map(function(v) { return v.trim(); });
						allData = allData.concat(values);
					}
				});

				// Clear container and add one row with merged data
				$('#wcsp-series-container').empty();
				seriesCounter = 0;
				addSeriesRow('Values', allData.join(', '));
			}
		} else {
			// Enable add series button for other charts
			$addButton.prop('disabled', false);
			$addButton.removeAttr('title');
			$addButton.removeClass('wcsp-disabled');
		}
	}

	/**
	 * Update categories/labels field label based on chart type
	 */
	function updateCategoriesLabel() {
		var chartType = $('#wcsp_chart_type').val();
		var isPieOrDonut = (chartType === 'pie' || chartType === 'donut');
		var $label = $('label[for="wcsp-gui-categories"] strong');
		var $field = $('#wcsp-gui-categories');

		if (isPieOrDonut) {
			$label.text('Slice Labels:');
			$field.attr('placeholder', 'Q1, Q2, Q3, Q4');
		} else {
			$label.text('X-Axis Categories:');
			$field.attr('placeholder', 'Jan, Feb, Mar, Apr, May, Jun');
		}
	}

	/**
	 * Validate numeric data and show feedback
	 */
	function validateNumericData(dataString, $field) {
		var values = dataString.split(',');
		var hasInvalid = false;

		values.forEach(function(v) {
			var num = parseFloat(v.trim());
			if (v.trim() !== '' && isNaN(num)) {
				hasInvalid = true;
			}
		});

		if (hasInvalid) {
			$field.addClass('wcsp-invalid');
			// Add validation message if not already present
			if ($field.next('.wcsp-validation-message').length === 0) {
				$field.after('<span class="wcsp-validation-message">Contains non-numeric values</span>');
			}
			return false;
		} else {
			$field.removeClass('wcsp-invalid');
			$field.next('.wcsp-validation-message').remove();
			return true;
		}
	}

	/**
	 * Clear all validation errors
	 */
	function clearValidationErrors() {
		$('.wcsp-invalid').removeClass('wcsp-invalid');
		$('.wcsp-validation-message').remove();
	}

	/**
	 * Escape HTML to prevent XSS
	 */
	function escapeHtml(text) {
		var map = {
			'&': '&amp;',
			'<': '&lt;',
			'>': '&gt;',
			'"': '&quot;',
			"'": '&#039;'
		};
		return String(text).replace(/[&<>"']/g, function(m) { return map[m]; });
	}

})(jQuery);
