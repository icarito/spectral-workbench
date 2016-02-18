describe("Set", function() {

  var graph, ajaxSpy;

  beforeAll(function() {

    var fixture = loadFixtures('graph.html');
    var setJSON = getJSONFixture('set-1.json');

    jasmine.Ajax.install();

    ajaxSpy = spyOn($, "ajax").and.callFake(function(object) {

      var response, 
          url = object.url.split('?')[0]; // remove cache-clearing additions

      if      (url == '/spectrums/9.json') response = object.success(TestResponses.spectrum.success.responseText);
      else if (url == '/sets/calibrated/1.json') response = object.success(setJSON); // faking with JSON fixture
      else if (url == '/spectrums/9/tags') response = object.success(TestResponses.tags.success.responseText);
      else if (url == '/spectrums/clone_calibration/9.json') response = object.success('success');
      else if (url == '/match/search/9.json') response = object.success([TestResponses.spectrum.success.responseText]); // return an array containing same spectrum
      else response = 'none';

      // check this if you have trouble faking a server response: 
      if (response != 'none') console.log('Faked response to:', object.url)
      else console.log('Failed to fake response to:', object.url)

    });

    graph = new SpectralWorkbench.Graph({
      set_id: 1,
      calibrated: true, 
      onComplete: function(graph) { // fires when graph.image is loaded, so that later tests can run

        expect(graph).toBeDefined();
        expect(graph.datum).toBeDefined();
        expect(graph.dataType).toBe('set');

        // done(); // for some reason, this doesn't need to be aynchronous with a Set. Not sure why? It does for a spectrum...

      }
    });

  });


  afterAll(function() {

    jasmine.Ajax.uninstall();

  });


  it("should initialize line styling and table rows properly", function() {

    expect(graph).toBeDefined();
    expect(graph.datum).toBeDefined();

    // you can't do jquery hasClass() to SVGs, but d3 can do classed();
    expect(d3.selectAll('g#spectrum-line-1')[0].length).toBe(2); // in main graph and in zoom graph
    expect(d3.selectAll('g#spectrum-line-2')[0].length).toBe(2); // in main graph and in zoom graph
    expect(d3.selectAll('g#spectrum-line-4')[0].length).toBe(2); // in main graph and in zoom graph
    expect(d3.selectAll('g#spectrum-line-6')[0].length).toBe(2); // in main graph and in zoom graph

    expect(d3.select('g#spectrum-line-1').classed('dimmed')).toBe(false);
    expect(d3.select('g#spectrum-line-2').classed('dimmed')).toBe(false);
    expect(d3.select('g#spectrum-line-4').classed('dimmed')).toBe(false);
    expect(d3.select('g#spectrum-line-6').classed('dimmed')).toBe(false);

    // these are currently manually added in the graph.html static fixture,
    // since they're normally generated by Ruby
    expect($('tr.spectrum-1').length).toBe(1);
    expect($('tr.spectrum-2').length).toBe(1);
    expect($('tr.spectrum-4').length).toBe(1);
    expect($('tr.spectrum-6').length).toBe(1);


// Can't seem to handle graph persistence... bah. 
// If we separate specs, the selectors don't find anything anymore
/*
  });


  it("should highlight graph line and dim others when hovering over table row", function() {
*/

    $('tr.spectrum-1').mouseover(); 

    expect(d3.select('g#spectrum-line-1').classed('dimmed')).toBe(false);
    expect(d3.select('g#spectrum-line-2').classed('dimmed')).toBe(true);
    expect(d3.select('g#spectrum-line-4').classed('dimmed')).toBe(true);
    expect(d3.select('g#spectrum-line-6').classed('dimmed')).toBe(true);

    expect(d3.select('g#spectrum-line-1').classed('highlight')).toBe(true);

/*
  });


  it("should highlight table row when hovering over graph line ", function() {
*/

    // this syntax is to trigger an SVG mouseover using D3:
    d3.select('g.nv-scatterWrap g#spectrum-hover-1')[0][0].dispatchEvent(new MouseEvent('mouseover'));

    expect($('tr.spectrum-1').hasClass('highlight')).toBe(true);
    expect($('tr.spectrum-2').hasClass('highlight')).toBe(false);
    expect($('tr.spectrum-4').hasClass('highlight')).toBe(false);
    expect($('tr.spectrum-6').hasClass('highlight')).toBe(false);

  });


/*
  // hover circles; should highlight table row
  d3.selectAll('g.nv-scatterWrap g.nv-groups g').mouseover();
  d3.selectAll('g#spectrum-line-'+datum.id).classed(   'highlight', true );

  // each table row should have a colored key matching its graph line
  $('tr.spectrum-'+datum.id+' div.key').css('background', $('g#spectrum-line-' + datum.id).css('stroke'));
*/

});
