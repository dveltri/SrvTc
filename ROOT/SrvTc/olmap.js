  		var lat=-23.521986;
  		var lat2=-23.522200;

			var lon=-46.777131;
			var lon2=-46.778000;
			
function StartM()
{
      var pos = ol.proj.fromLonLat([lon,lat]);
			var pos2 = ol.proj.fromLonLat([lon2,lat2]);
			
      var layer = new ol.layer.Tile({source: new ol.source.OSM()});
			var View = new ol.View({center: ol.proj.transform([lon,lat],'EPSG:4326','EPSG:3857'),zoom:17})

      var source = new ol.source.Vector({wrapX: false});

      var vector = new ol.layer.Vector({
        source: source,
        style: new ol.style.Style({
          fill: new ol.style.Fill({
            color: 'rgba(255, 255, 255, 0.2)'
          }),
          stroke: new ol.style.Stroke({
            color: '#ffcc33',
            width: 2
          }),
          image: new ol.style.Circle({
            radius: 7,
            fill: new ol.style.Fill({
              color: '#ffcc33'
            })
          })
        })
      });
			
      var map = new ol.Map({
				layers: [layer,vector],
				target: 'map',
				view: View
      });

      var marker = new ol.Overlay({
        position: pos,
        positioning: 'center-center',
        element: document.getElementById('marker'),
        stopEvent: false
				});

      var ItemText = new ol.Overlay({
        position: pos,
        element: document.getElementById('ItemText')
				});

      var popup = new ol.Overlay({
				element: document.getElementById('popup')
				});
			popup.setPosition();
			
			map.addOverlay(marker);
      map.addOverlay(ItemText);
      map.addOverlay(popup);

			var source = new ol.source.Vector({wrapX: false});
			var vector = new ol.layer.Vector({source:source});

			/*var pointFeature = 		new ol.Feature(new ol.geom.Point(pos2));
			pointFeature.attributes = {
							name: "toto",
              age: 20,
              favColor: 'red',
              align: "cm"
							};
			source.addFeature(pointFeature);
			// */
			var LinePoints=[ol.proj.fromLonLat([-46.776000,-23.523000]),ol.proj.fromLonLat([-46.779000,-23.521000])];
			var lineFeature = 		new ol.Feature(new ol.geom.LineString(LinePoints));
			var lineStyle = new ol.style.Style({stroke: new ol.style.Stroke({color:'rgba(140,20,20,0.7)',width:10})	});
			lineFeature.setStyle(lineStyle);
			source.addFeature(lineFeature);

			var LinePoints=[ol.proj.fromLonLat([-46.776000,-23.521000]),ol.proj.fromLonLat([-46.779000,-23.523000])];
			var lineFeature = 		new ol.Feature(new ol.geom.LineString(LinePoints));
			var lineStyle = new ol.style.Style({stroke: new ol.style.Stroke({color:'rgba(20,140,20,0.7)',width:10})	});
			lineFeature.setStyle(lineStyle);
			source.addFeature(lineFeature);// */
			
			
			var PolyPoints=[ol.proj.fromLonLat([-46.776000,-23.523000]),
											ol.proj.fromLonLat([-46.776000,-23.521000]),
											ol.proj.fromLonLat([-46.779000,-23.521000]),
											ol.proj.fromLonLat([-46.779000,-23.523000]),
											ol.proj.fromLonLat([-46.776000,-23.523000])];
			var polygonFeature = 	new ol.Feature(new ol.geom.Polygon([PolyPoints]));
			source.addFeature(polygonFeature);
			map.addLayer(vector);
	}
			

