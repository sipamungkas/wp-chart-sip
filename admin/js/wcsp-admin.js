/**
 * Admin JavaScript for WP Chart SIP
 */

(function($) {
	'use strict';

	// Store chart instance globally to manage it properly
	var chartInstance = null;

	// Debounce timer for sync operations
	var guiToJsonTimer = null;

	// Chart type configurations
	var chartTypeConfigs = {
		'line': {
			dataType: 'standard', // name + data array
			needsCategories: true,
			seriesLabel: 'Data Series:',
			categoriesLabel: 'X-Axis Labels:',
			categoriesPlaceholder: 'Jan, Feb, Mar, Apr, May, Jun',
			dataPlaceholder: '30, 40, 35, 50, 49, 60',
			description: 'Add series with names and numeric values. Each series will be a line on the chart.',
			allowMultipleSeries: true
		},
		'bar': {
			dataType: 'standard',
			needsCategories: true,
			seriesLabel: 'Data Series:',
			categoriesLabel: 'X-Axis Categories:',
			categoriesPlaceholder: 'Product A, Product B, Product C',
			dataPlaceholder: '30, 40, 35, 50, 49, 60',
			description: 'Add series with names and numeric values. Each series will be a set of bars.',
			allowMultipleSeries: true
		},
		'area': {
			dataType: 'standard',
			needsCategories: true,
			seriesLabel: 'Data Series:',
			categoriesLabel: 'X-Axis Labels:',
			categoriesPlaceholder: 'Jan, Feb, Mar, Apr, May, Jun',
			dataPlaceholder: '30, 40, 35, 50, 49, 60',
			description: 'Add series with names and numeric values. Each series will be an area on the chart.',
			allowMultipleSeries: true
		},
		'radar': {
			dataType: 'standard',
			needsCategories: true,
			seriesLabel: 'Data Series:',
			categoriesLabel: 'Axis Labels:',
			categoriesPlaceholder: 'Speed, Strength, Intelligence, Magic, Defense',
			dataPlaceholder: '80, 50, 30, 40, 100',
			description: 'Add series with names and numeric values for each axis.',
			allowMultipleSeries: true
		},
		'pie': {
			dataType: 'pie', // flat array
			needsCategories: true,
			seriesLabel: 'Slice Values:',
			categoriesLabel: 'Slice Labels:',
			categoriesPlaceholder: 'Team A, Team B, Team C, Team D',
			dataPlaceholder: '44, 55, 13, 33',
			description: 'Enter numeric values for each slice and their corresponding labels.',
			allowMultipleSeries: false
		},
		'donut': {
			dataType: 'pie',
			needsCategories: true,
			seriesLabel: 'Slice Values:',
			categoriesLabel: 'Slice Labels:',
			categoriesPlaceholder: 'Team A, Team B, Team C, Team D',
			dataPlaceholder: '44, 55, 13, 33',
			description: 'Enter numeric values for each slice and their corresponding labels.',
			allowMultipleSeries: false
		},
		'scatter': {
			dataType: 'scatter', // [x, y] pairs
			needsCategories: false,
			seriesLabel: 'Data Series:',
			categoriesLabel: '',
			categoriesPlaceholder: '',
			dataPlaceholder: '16.4,5.4; 21.7,2; 25.4,3; 19,2',
			description: 'Enter X,Y coordinate pairs separated by semicolons (e.g., "16.4,5.4; 21.7,2; 25.4,3").',
			allowMultipleSeries: true
		},
		'heatmap': {
			dataType: 'heatmap', // {x, y} objects
			needsCategories: false,
			seriesLabel: 'Data Series:',
			categoriesLabel: '',
			categoriesPlaceholder: '',
			dataPlaceholder: 'W1,22; W2,29; W3,13; W4,32',
			description: 'Enter X-label,Y-value pairs separated by semicolons (e.g., "W1,22; W2,29; W3,13").',
			allowMultipleSeries: true
		}
	};

	$(document).ready(function() {
		// Chart preview functionality
		$('#wcsp_preview_chart').on('click', function(e) {
			e.preventDefault();
			// Convert GUI to JSON first
			convertGuiToJson();
			previewChart();
		});

		// Chart insert modal functionality
		$('.wcsp-insert-chart-button').on('click', function(e) {
			e.preventDefault();
			showChartSelectionModal();
		});

		// Chart type change handler - trigger immediate sync
		$('#wcsp_chart_type').on('change', function() {
			handleChartTypeChange();
		});

		// Add series button
		$('#wcsp-add-series').on('click', function() {
			addSeriesRow();
		});

		// Initialize GUI with existing data or empty state
		initializeGuiMode();

		// Real-time GUI → JSON sync (debounced) - Use event delegation
		$('#wcsp-series-container').on('input change', '.wcsp-series-name, .wcsp-series-data', function() {
			debouncedConvertGuiToJson();
		});
		$('#wcsp-gui-categories, #wcsp-gui-title, #wcsp-gui-colors, #wcsp-gui-height').on('input change', function() {
			debouncedConvertGuiToJson();
		});

		// Convert GUI to JSON before saving (always sync regardless of active tab)
		$('form#post').on('submit', function() {
			// Always convert GUI to JSON to ensure JSON fields have latest data
			if ($('#wcsp-series-container').children().length > 0) {
				convertGuiToJson();
			}
		});

		// Color template selector
		$('#wcsp-color-template').on('change', function() {
			var selectedOption = $(this).find('option:selected');
			var colors = selectedOption.data('colors');

			if (colors && colors.length > 0) {
				// Update the color input field
				$('#wcsp-gui-colors').val(colors.join(', '));

				// Show template preview
				showColorPreview(colors);
			} else {
				// Hide preview if no template selected
				$('#wcsp-template-preview').hide();
			}
		});

		// Show preview for manually entered colors
		$('#wcsp-gui-colors').on('input blur', function() {
			var colorsStr = $(this).val().trim();
			if (colorsStr) {
				var colors = colorsStr.split(',').map(function(c) { return c.trim(); });
				showColorPreview(colors);
			} else {
				$('#wcsp-template-preview').hide();
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
		var chartType = $('#wcsp_chart_type').val();
		var config = chartTypeConfigs[chartType] || chartTypeConfigs['line'];

		// Use timestamp-based unique index to avoid conflicts
		var uniqueIndex = 'series_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
		name = name || 'Series ' + seriesCounter;
		data = data || '';

		var html = '<div class="wcsp-series-row" data-index="' + uniqueIndex + '">' +
			'<div class="wcsp-series-fields">';

		// For pie/donut charts, don't show series name field
		if (config.dataType === 'pie') {
			html += '<div class="wcsp-series-field wcsp-series-data-field">' +
				'<label>Slice Values:</label>' +
				'<input type="text" class="wcsp-series-data" value="' + escapeHtml(data) + '" placeholder="' + escapeHtml(config.dataPlaceholder) + '">' +
				'</div>';
		} else {
			// For all other charts, show both name and data fields
			html += '<div class="wcsp-series-field">' +
				'<label>Series Name:</label>' +
				'<input type="text" class="wcsp-series-name" value="' + escapeHtml(name) + '" placeholder="e.g., Sales">' +
				'</div>' +
				'<div class="wcsp-series-field wcsp-series-data-field">' +
				'<label>Data Values:</label>' +
				'<input type="text" class="wcsp-series-data" value="' + escapeHtml(data) + '" placeholder="' + escapeHtml(config.dataPlaceholder) + '">' +
				'</div>';
		}

		html += '<button type="button" class="button wcsp-remove-series" title="Remove Series">' +
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
				debouncedConvertGuiToJson();
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
		var config = chartTypeConfigs[chartType] || chartTypeConfigs['line'];
		var series = [];
		var categories = [];
		var labels = [];

		// Clear previous validation errors
		clearValidationErrors();

		// Get series data based on chart type
		if (config.dataType === 'pie') {
			// For pie/donut charts, series is a flat array of numbers
			var allDataValues = [];
			$('.wcsp-series-row').each(function() {
				var $dataField = $(this).find('.wcsp-series-data');
				var dataStr = $dataField.val().trim();
				if (dataStr) {
					// Parse data values and add to flat array
					var dataValues = dataStr.split(',').map(function(v) {
						var num = parseFloat(v.trim());
						return isNaN(num) ? 0 : num;
					});
					allDataValues = allDataValues.concat(dataValues);
				}
			});
			series = allDataValues;
		} else if (config.dataType === 'scatter') {
			// For scatter charts, series contains [x, y] coordinate pairs
			$('.wcsp-series-row').each(function() {
				var name = $(this).find('.wcsp-series-name').val().trim();
				var $dataField = $(this).find('.wcsp-series-data');
				var dataStr = $dataField.val().trim();

				if (dataStr) {
					// Parse X,Y pairs separated by semicolons
					// Format: "16.4,5.4; 21.7,2; 25.4,3; 19,2"
					var dataValues = [];
					var pairs = dataStr.split(';');
					pairs.forEach(function(pair) {
						var coords = pair.trim().split(',');
						if (coords.length === 2) {
							var x = parseFloat(coords[0].trim());
							var y = parseFloat(coords[1].trim());
							if (!isNaN(x) && !isNaN(y)) {
								dataValues.push([x, y]);
							}
						}
					});

					series.push({
						name: name || 'Series',
						data: dataValues
					});
				}
			});
		} else if (config.dataType === 'heatmap') {
			// For heatmap, series contains {x, y} objects
			$('.wcsp-series-row').each(function() {
				var name = $(this).find('.wcsp-series-name').val().trim();
				var $dataField = $(this).find('.wcsp-series-data');
				var dataStr = $dataField.val().trim();

				if (dataStr) {
					// Parse X-label,Y-value pairs separated by semicolons
					// Format: "W1,22; W2,29; W3,13; W4,32"
					var dataValues = [];
					var pairs = dataStr.split(';');
					pairs.forEach(function(pair) {
						var parts = pair.trim().split(',');
						if (parts.length === 2) {
							var x = parts[0].trim();
							var y = parseFloat(parts[1].trim());
							if (x && !isNaN(y)) {
								dataValues.push({ x: x, y: y });
							}
						}
					});

					series.push({
						name: name || 'Series',
						data: dataValues
					});
				}
			});
		} else {
			// For standard charts (line, bar, area, radar), series is an array of objects with name and data
			$('.wcsp-series-row').each(function() {
				var name = $(this).find('.wcsp-series-name').val().trim();
				var $dataField = $(this).find('.wcsp-series-data');
				var dataStr = $dataField.val().trim();

				if (dataStr) {
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

		// Get categories/labels if needed
		if (config.needsCategories) {
			var categoriesStr = $('#wcsp-gui-categories').val().trim();
			if (categoriesStr) {
				if (config.dataType === 'pie') {
					labels = categoriesStr.split(',').map(function(v) { return v.trim(); });
				} else {
					categories = categoriesStr.split(',').map(function(v) { return v.trim(); });
				}
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
			var config = chartTypeConfigs[chartType] || chartTypeConfigs['line'];

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

			// Load series based on chart type
			if (data.series && data.series.length > 0) {
				if (config.dataType === 'pie') {
					// For pie/donut, series is a flat array of numbers
					if (Array.isArray(data.series) && typeof data.series[0] === 'number') {
						addSeriesRow('Values', data.series.join(', '));
					} else {
						console.warn('Unexpected series format for pie/donut chart');
						addSeriesRow('Values', '');
					}
				} else if (config.dataType === 'scatter') {
					// For scatter charts, series contains [x, y] pairs
					if (Array.isArray(data.series)) {
						data.series.forEach(function(seriesItem) {
							if (seriesItem && typeof seriesItem === 'object') {
								var name = seriesItem.name || 'Series';
								// Convert [[x1, y1], [x2, y2]] to "x1,y1; x2,y2"
								var dataStr = '';
								if (Array.isArray(seriesItem.data)) {
									dataStr = seriesItem.data.map(function(pair) {
										if (Array.isArray(pair) && pair.length === 2) {
											return pair[0] + ',' + pair[1];
										}
										return '';
									}).filter(function(s) { return s; }).join('; ');
								}
								addSeriesRow(name, dataStr);
							}
						});
					}
				} else if (config.dataType === 'heatmap') {
					// For heatmap, series contains {x, y} objects
					if (Array.isArray(data.series)) {
						data.series.forEach(function(seriesItem) {
							if (seriesItem && typeof seriesItem === 'object') {
								var name = seriesItem.name || 'Series';
								// Convert [{x: 'W1', y: 22}, {x: 'W2', y: 29}] to "W1,22; W2,29"
								var dataStr = '';
								if (Array.isArray(seriesItem.data)) {
									dataStr = seriesItem.data.map(function(obj) {
										if (obj && typeof obj === 'object' && 'x' in obj && 'y' in obj) {
											return obj.x + ',' + obj.y;
										}
										return '';
									}).filter(function(s) { return s; }).join('; ');
								}
								addSeriesRow(name, dataStr);
							}
						});
					}
				} else {
					// For standard charts (line, bar, area, radar)
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
		updateUiForChartType();
	}

	/**
	 * Update UI elements based on selected chart type
	 */
	function updateUiForChartType() {
		var chartType = $('#wcsp_chart_type').val();
		var config = chartTypeConfigs[chartType] || chartTypeConfigs['line'];

		// Update description
		$('#wcsp-data-description').text(config.description);

		// Update series label
		$('#wcsp-series-label').text(config.seriesLabel);

		// Update categories field visibility and label
		if (config.needsCategories) {
			$('#wcsp-categories-field').show();
			$('#wcsp-categories-label').text(config.categoriesLabel);
			$('#wcsp-gui-categories').attr('placeholder', config.categoriesPlaceholder);
			$('#wcsp-categories-description').text('Enter labels separated by commas.');
		} else {
			$('#wcsp-categories-field').hide();
		}

		// Update add series button state
		var $addButton = $('#wcsp-add-series');
		if (config.allowMultipleSeries) {
			$addButton.prop('disabled', false);
			$addButton.removeClass('wcsp-disabled');
			$addButton.removeAttr('title');
		} else {
			$addButton.prop('disabled', true);
			$addButton.addClass('wcsp-disabled');
			$addButton.attr('title', 'This chart type only supports a single data series');

			// Ensure only one series row exists for pie/donut
			if ($('.wcsp-series-row').length > 1) {
				var allData = [];
				$('.wcsp-series-row').each(function() {
					var dataStr = $(this).find('.wcsp-series-data').val().trim();
					if (dataStr) {
						var values = dataStr.split(',').map(function(v) { return v.trim(); });
						allData = allData.concat(values);
					}
				});
				$('#wcsp-series-container').empty();
				seriesCounter = 0;
				addSeriesRow('Values', allData.join(', '));
			}
		}
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
	 * Handle chart type change
	 */
	function handleChartTypeChange() {
		var newChartType = $('#wcsp_chart_type').val();
		var oldChartData = $('#wcsp_chart_data').val().trim();
		var newConfig = chartTypeConfigs[newChartType] || chartTypeConfigs['line'];

		// Update UI controls and labels
		updateUiForChartType();

		// If we have existing data, restructure it for the new chart type
		if (oldChartData) {
			try {
				var data = JSON.parse(oldChartData);
				var oldDataType = detectDataType(data);

				// Restructure data if switching between different data types
				if (oldDataType !== newConfig.dataType) {
					data = convertDataStructure(data, oldDataType, newConfig.dataType);
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
	 * Detect the data type from existing data structure
	 */
	function detectDataType(data) {
		if (!data.series || !Array.isArray(data.series) || data.series.length === 0) {
			return 'standard';
		}

		var firstItem = data.series[0];

		// Check if it's a flat array (pie/donut)
		if (typeof firstItem === 'number') {
			return 'pie';
		}

		// Check if it's an object with data property
		if (typeof firstItem === 'object' && firstItem.data) {
			var firstDataItem = firstItem.data[0];

			// Check for scatter data [x, y]
			if (Array.isArray(firstDataItem) && firstDataItem.length === 2) {
				return 'scatter';
			}

			// Check for heatmap data {x, y}
			if (typeof firstDataItem === 'object' && 'x' in firstDataItem && 'y' in firstDataItem) {
				return 'heatmap';
			}

			// Standard data (numbers)
			return 'standard';
		}

		return 'standard';
	}

	/**
	 * Convert data structure from one type to another
	 */
	function convertDataStructure(data, fromType, toType) {
		var newData = { series: [] };

		if (fromType === 'pie' && toType !== 'pie') {
			// Converting FROM pie to other types
			if (Array.isArray(data.series)) {
				newData.series.push({
					name: 'Series 1',
					data: data.series
				});
			}
			if (data.labels) {
				newData.categories = data.labels;
			}
		} else if (fromType !== 'pie' && toType === 'pie') {
			// Converting TO pie from other types
			var flatData = [];
			if (Array.isArray(data.series)) {
				data.series.forEach(function(series) {
					if (series.data && Array.isArray(series.data)) {
						// Extract just numeric values
						series.data.forEach(function(item) {
							if (typeof item === 'number') {
								flatData.push(item);
							} else if (Array.isArray(item) && item.length > 0) {
								flatData.push(typeof item[0] === 'number' ? item[0] : item[1]);
							} else if (typeof item === 'object' && 'y' in item) {
								flatData.push(item.y);
							}
						});
					}
				});
			}
			newData.series = flatData;
			if (data.categories) {
				newData.labels = data.categories;
			}
		} else {
			// Same type or standard conversions
			newData = data;
		}

		return newData;
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

	/**
	 * Show color preview swatches
	 */
	function showColorPreview(colors) {
		if (!colors || colors.length === 0) {
			$('#wcsp-template-preview').hide();
			return;
		}

		var swatchesHtml = '';
		colors.forEach(function(color) {
			swatchesHtml += '<span class="wcsp-color-swatch" style="background-color: ' + escapeHtml(color) + '" title="' + escapeHtml(color) + '"></span>';
		});

		$('#wcsp-template-preview .wcsp-color-swatches').html(swatchesHtml);
		$('#wcsp-template-preview').show();
	}

})(jQuery);
