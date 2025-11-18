/**
 * Public JavaScript for WP Chart SIP
 */

(function($) {
	'use strict';

	$(document).ready(function() {
		// Initialize any additional chart interactions
		initChartInteractions();
	});

	/**
	 * Initialize chart interactions
	 */
	function initChartInteractions() {
		// Add custom event listeners or interactions here
		// For example: tooltips, click handlers, etc.

		// Ensure charts are responsive on window resize
		var resizeTimer;
		$(window).on('resize', function() {
			clearTimeout(resizeTimer);
			resizeTimer = setTimeout(function() {
				// Charts will auto-resize with ApexCharts
				// Additional resize handling can go here
			}, 250);
		});
	}

	/**
	 * Public API for interacting with charts
	 */
	window.WCSPCharts = {
		/**
		 * Refresh a specific chart by ID
		 */
		refreshChart: function(chartId) {
			// Implementation for refreshing charts dynamically
			console.log('Refreshing chart:', chartId);
		},

		/**
		 * Update chart data dynamically
		 */
		updateChartData: function(chartId, newData) {
			// Implementation for updating chart data
			console.log('Updating chart data:', chartId, newData);
		}
	};

})(jQuery);
