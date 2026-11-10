#!/bin/sh
# Builds data/geo/*.json (TopoJSON) from datameet (Survey of India boundaries), Natural Earth and OSM sources.
set -e
G=${GEO_SRC:-/private/tmp/claude-502/-Users-gopi-4423-Documents/5479fb8b-36f4-47ed-aca0-eb3aabd2bb35/scratchpad/geo}
M="npx -y mapshaper@0.7.101"
$M -i $G/Admin2.shp -simplify 0.6% keep-shapes -rename-fields name=ST_NM -o data/geo/india-states.json format=topojson quantization=1e5
$M -i $G/2011_Dist.shp -filter "ST_NM=='Tamil Nadu'" -simplify 4% keep-shapes -rename-fields name=DISTRICT -filter-fields name -o data/geo/tn-districts.json format=topojson quantization=1e5
$M -i /tmp/rivers.geojson -dissolve id -simplify 8% -o data/geo/rivers.json format=topojson quantization=1e5
$M -i $G/ne_110m_admin_0_countries.geojson -filter "ADMIN!='India'" -filter-fields NAME,CONTINENT -o /tmp/world-noin.json format=geojson
$M -i $G/Admin2.shp -dissolve -each "NAME='India', CONTINENT='Asia'" -simplify 0.3% -o /tmp/india1.json format=geojson
$M -i combine-files /tmp/world-noin.json /tmp/india1.json -merge-layers force -simplify 30% keep-shapes -o data/geo/world.json format=topojson quantization=1e5
