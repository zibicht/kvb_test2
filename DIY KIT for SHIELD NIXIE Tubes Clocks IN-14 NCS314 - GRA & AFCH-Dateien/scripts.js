	jQuery( document ).ready( function ($) {

		// Expand/Collapse accordion sections on click.
		$( '.acco' ).accordion({
      collapsible: true,
      active: false,
      header: ".accordion-section",
      content: ".ui-accordion-content",
      heightStyle: "content",
      classes: {
          "ui-accordion": "acco",
          "ui-accordion-content" : "ui-accordion-content"
      }
});

	});



