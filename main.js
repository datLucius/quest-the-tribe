const graph = () => {
  const display = document.getElementById("display"),
    width = 500,
    height = 500,
    nodeRadius = 10,
    widthWithBoundary = width - 100,
    heightWithBoundary = height - 100,
    force = d3.layout.force(),
    layout = 'force',
    nodesMap = d3.map();
  let nodeAttributes = [],
    allData = [],
    currentNodesData = [],
    formattedNodes = [],
    nodesGRoot = null,
    node = null,
    visualization = null;

  function network(selection, data) {
    initializeVisualization(selection);

    initializeData(data);

    createNodeRoot();

    initializeForceGraph();

    updateVisualization();
  }

  function initializeVisualization(selection) {
    visualization = d3.select(selection)
      .append("svg")
      .attr("width", width)
      .attr("height", height);
  }

  function initializeData(data) {
    allData = setupData(data);
  }

  function createNodeRoot() {
    nodesGRoot = visualization.append("g").attr("id", "nodes");
  }

  function initializeForceGraph() {
    force
      .size([width, height])
      .on("tick", forceTick)
      .charge(-500)
      .linkDistance(200);
  }


  function setupData(data) {
    formattedNodes = assignAttributesToNodes(data.nodes);

    generateD3Map(formattedNodes);

    formattedNodes = [];

    return data;
  };

  function forceTick() {
    node
      .attr("cx", d => d.x)
      .attr("cy", d => d.y);
  };

  function pauseForceForAction(action) {
    force.stop();
    action();
    force.start();
  }

  function updateVisualization() {
    pauseForceForAction(() => {
      currentNodesData = allData.nodes;

      force.nodes(currentNodesData);

      updateNodesWithNewData();
    })
  };

  function updateNodesWithNewData() {
    node = nodesGRoot.selectAll("circle")
      .data(currentNodesData);

    node.enter().append("circle")
        .attr("class", "node")
        .attr("x", d => d.x)
        .attr("y", d => d.y)
        .attr("cx", d => d.x)
        .attr("cy", d => d.y)
        .attr("r", d => d.radius)
        .style("fill", "red");

    node.exit().remove();
  };

  document.body.onclick = function () {
    generateNewNode();
  }


  function generateNewNode() {
      nodeAttributes = createAttributesForNodes();

      currentNodesData.push({
        "id": `new_node${currentNodesData.length}`,
        "name": `New Node ${currentNodesData.length}`,
        "x": nodeAttributes[0],
        "y": nodeAttributes[1],
        "radius": nodeAttributes[2]
      });

      generateD3Map(currentNodesData);

      updateVisualization();

      nodeAttributes = [];
  }

  function createAttributesForNodes() {
    const randomCords = generateRandomCordinatesWithinBoundary();
    return [randomCords[0], randomCords[1], nodeRadius];
  }

  function assignAttributesToNodes(nodes) {
    nodes.forEach(n => {
      nodeAttributes = createAttributesForNodes();
      n.x = nodeAttributes[0];
      n.y = nodeAttributes[1];
      n.radius = nodeAttributes[2];
      nodeAttributes = [];
    });
    return nodes;
  }

  function generateRandomCordinatesWithinBoundary() {
    let randomXValueWithinBoundary = Math.floor(Math.random()*widthWithBoundary);
    let randomYValueWithinBoundary = Math.floor(Math.random()*heightWithBoundary);
    return [randomXValueWithinBoundary, randomYValueWithinBoundary];
  };

  function generateD3Map(nodes) {
    nodes.forEach(n =>
      nodesMap.set(n.id, n)
    );
  };

  return network;
}

const lowEndTheoryAlbumData = {
  "id": "low_end_theory"
  "name": "Low End Theory",
  "type": "album"
  "songs": [
    {
      "id": "excursions",
      "name": "Excursions",
      "type": "song",
      "references": [
        {
          "id": "zulu_nation",
          "name": "Zulu Nation",
          "type": "shout"
        },
        {
          "id": "art_blakey",
          "name": "Art Blakey",
          "type": "sample",
          "sample": "A Chant for Bu"
        },
        {
          "id": "the_shades_of_brown",
          "name": "The Shades of Brown",
          "type": "sample",
          "sample": "The Soil I Tilled for You"
        },
        {
          "id": "the_last_poets",
          "name": "The Last Poets",
          "type": "sample",
          "sample": "Time Is Running Out"
        },
        {
          "id": "bobby_brown",
          "name": "Bobby Brown",
          "type": "shout"
        },
      ]
    },
    {
      "id": "buggin_out",
      "name": "Buggin' Out",
      "type": "song",
      "references": [
        {
          "id": "spinning_wheel",
          "name": "Spinning Wheel",
          "artist": "Dr Lonnie Smith",
          "type": "sample"
        },
        {
          "id": "Minyas_the_Mooch",
          "type": "sample",
          "name": "Minya's the Mooch"
        },
        {
          "id": "big_daddy_kane",
          "name": "Big Daddy Kane",
          "type": "shout"
        },
        {
          "id": "special_ed",
          "name": "Special Ed",
          "type": "shout"
        },
        {
          "id": "zulu_nation",
          "name": "Zulu Nation",
          "type": "shout"
        }
      ]
    },
    {
      "id": "rap_promoter",
      "name": "Rap Promoter",
      "type": "song",
      "references": [
        {
          "id": "peter_paul_and_mary",
          "name": "Peter Paul and Mary",
          "type": "sample",
          "sample": "Leaving on a Jet Plane"
        },
        {
          "id": "the_new_birth",
          "name": "The New Birth",
          "type": "sample",
          "sample": "Keep on Doin' It"
        },
        {
          "id": "sugarhill_gang",
          "name": "SugarHill Gang",
          "type": "sample",
          "sample": "8th Wonder"
        },
        {
          "id": "busy_bee",
          "name": "Busy Bee",
          "type": "shout",
          "note": "Making Cash Money"
        },
        {
          "id": "brooklyn_zu",
          "name": "The Brooklyn Zu",
          "type": "shout",
        },
        {
          "id": "eric_mercury",
          "name": "Eric Mercury",
          "type": "sample",
          "sample": "Long Way Down"
        }
      ]
    },
    {
      "id": "butter",
      "name": "Butter",
      "type": "song",
      "references": [
        {
          "id": "gary_bartz",
          "name": "Gary Bartz",
          "type": "sample",
          "sample": "Gentle Smiles"
        },
        {
          "id": "chuck_jackson",
          "name": "Chuck Jackson",
          "type": "sample",
          "sample": "I Like Everything About You"
        },
        {
          "id": "weather_report",
          "name": "Weather Report",
          "type": "sample",
          "sample": "Young and Fine"
        },
        {
          "id": "bell_biv_devoe",
          "name": "Bell Biv Devoe",
          "type": "shout",
          "note": "I thought it was me"
        },
        {
          "id": "heavy_d",
          "name": "Heavy D",
          "type": "shout",
          "note": "Somebody for Me"
        },
        {
          "id": "alexander_oneal",
          "name": "Alexander O'Neal",
          "type": "shout",
          "note": "All True Man"
        },
        {
          "id": "krs_one",
          "name": "KRS One",
          "type": "shout",
          "note": "Super Ho"
        },
        {
          "id": "father_mc",
          "name": "Father MC",
          "type": "shout",
          "note": "Treat them like they want to be treated"
        },
        {
          "id": "ralph_tresvant",
          "name": "Ralp Tresvant",
          "type": "shout",
          "note": "Sensitivity"
        }
      ]
    },
    {
      "id": "verses_from_the_abstract",
      "name": "Verses From the Abstract",
      "type": "song",
      "references": [
        {
          "id": "busta_rhymes",
          "name": "Busta Rhymes",
          "type": "shout",
        },
        {
          "id": "heat_wave",
          "name": "Heat Wave",
          "type": "sample",
          "sample": "The Star of the Story"
        },
        {
          "id": "joe_farrell",
          "name": "Joe Farrell",
          "type": "sample",
          "sample": "Upon This Rock"
        },
        {
          "id": "bob_power",
          "name": "Bob Power",
          "type": "shout",
        },
        {
          "id": "tim_lantham",
          "name": "Tim Lantham",
          "type": "shout",
        },
        {
          "id": "brand_nubians",
          "name": "Brand Nubians",
          "type": "shout",
        },
        {
          "id": "jungle_brothers",
          "name": "Jungle Brothers",
          "type": "shout",
        },
        {
          "id": "de_la_soul",
          "name": "De La Soul",
          "type": "shout",
        },
        {
          "id": "bobby_byrd",
          "name": "Bobby Byrd",
          "type": "shout",
        },
        {
          "id": "pete_rock_and_cl_smooth",
          "name": "Pete Rock and CL Smooth",
          "type": "shout",
        },
        {
          "id": "ultramagnetic_mcs",
          "name": "Ultramagnetic MC's",
          "type": "shout",
        },
        {
          "id": "nice_and_smooth",
          "name": "Nice & Smooth",
          "type": "shout",
        },
        {
          "id": "beatnuts",
          "name": "Beatnuts",
          "type": "shout",
        },
        {
          "id": "ron_carter",
          "name": "Ron Carter",
          "type": "shout",
        }
      ]
    },
    {
      "id": "show_business",
      "name": "Show Business",
      "type": "song",
      "references": [
        {
          "id": "diamond_d",
          "name": "Diamond_D",
          "type": "artist",
        },
        {
          "id": "lord_jamar",
          "name": "Lord Jamar",
          "type": "artist",
        },
        {
          "id": "sadat_x",
          "name": "Sadat X",
          "type": "artist",
        },
        {
          "id": "ferrante_and_teicher",
          "name": "Ferrante and Teicher",
          "type": "sample",
          "sample": "Midnight Cowboy"
        },
        {
          "id": "the_fatback_band",
          "name": "The Fatback Band",
          "type": "sample",
          "sample": "Wicki Wacky"
        },
        {
          "id": "gerson_king_combo",
          "name": "Gerson King Combo",
          "type": "sample",
          "sample": "Madamentos Black"
        },
        {
          "id": "james_brown",
          "name": "James Brown",
          "type": "sample",
          "sample": "Funky President"
        },
        {
          "id": "aretha_franklin",
          "name": "Aretha Franklin",
          "type": "sample",
          "sample": "Rock Steady"
        },
        {
          "id": "kurtis_blow",
          "name": "Kurtis Blow",
          "type": "shout",
        },
        {
          "id": "public_enemy",
          "name": "Public Enemy",
          "type": "shout",
        }
      ]
    },
    {
      "id": "vibes_and_stuff",
      "name": "Vibes and Stuff",
      "type": "song",
      "references": [
        {
          "id": "grant_green",
          "name": "Grant Green",
          "type": "sample",
          "sample": "Down Here on the Ground"
        },
        {
          "id": "kool_g_raps",
          "name": "Kool G Raps",
          "type": "shout",
        },
        {
          "id": "afrika_bambaataa",
          "name": "Afrika Bambaataa",
          "type": "shout",
        },
        {
          "id": "mc_trouble",
          "name": "MC Trouble",
          "type": "shout",
        },
        {
          "id": "trouble_t_roy",
          "name": "Trouble T Roy",
          "type": "shout",
        },
        {
          "id": "scott_la_rock",
          "name": "Scott La Rock",
          "type": "shout",
        },
        {
          "id": "cowboy",
          "name": "Cowboy",
          "type": "shout",
        }
      ]
    },
    {
      "id": "the_infamous_date_rape",
      "name": "The Infamous Date Rape",
      "type": "song",
      "references": [
        {
          "id": "jackie_jackson",
          "name": "Jackie Jackson",
          "type": "sample",
          "sample": "Is It Him or Me?"
        },
        {
          "id": "cannonball_adderly",
          "name": "Cannonball Adderly",
          "type": "sample",
          "sample": "The Steam Drill"
        },
        {
          "id": "mc_lyte",
          "name": "MC Lyte",
          "type": "sample",
          "sample": "10% Dis"
        },
        {
          "id": "boogie_down_productions",
          "name": "Boogie Down Productions",
          "type": "sample",
          "sample": "Love Gonna Get'cha"
        },
        {
          "id": "ray_charles",
          "name": "Ray Charles",
          "type": "shout",
        },
        {
          "id": "afta_7",
          "name": "Afta 7",
          "type": "shout",
        },
        {
          "id": "zulu_nation",
          "name": "Zulu Nation",
          "type": "shout"
        }
      ]
    },
    {
      "id": "check_the_rhime",
      "name": "Check The Rhime",
      "type": "song",
      "references": [
        {
          "id": "minnie_riperton",
          "name": "Minnie Riperton",
          "type": "sample",
          "sample": "Baby, This Love I Have"
        },
        {
          "id": "average_white_band",
          "name": "Average White Band",
          "type": "sample",
          "sample": "Love Your Life"
        },
        {
          "id": "grover_washington_jr",
          "name": "Grover Washington Jr.",
          "type": "sample",
          "sample": "Hydra"
        },
        {
          "id": "dalton_and_dubarri",
          "name": "Dalton and Dubarri",
          "type": "sample",
          "sample": "I'm just a Rock N Roller"
        },
        {
          "id": "biz_markie",
          "name": "Biz Markie",
          "type": "sample",
          "sample": "Nobody Beats the Biz"
        },
        {
          "id": "lafayette_afro_rock_band",
          "name": "Lafayette Afro Rock Band",
          "type": "sample",
          "sample": "Hiache"
        }
      ]
    },
    {
      "id": "everything_is_fair",
      "name": "Everything Is Fair",
      "type": "song",
      "references": [
        {
          "id": "parliament_funkadelic",
          "name": "Parliament Funkadelic",
          "type": "sample",
          "sample": "Let's Take it to the People"
        },
        {
          "id": "harlem_underground_band",
          "name": "Harlem Underground Band",
          "type": "sample",
          "sample": "Aint' No Sunshine"
        }
      ]
    },
    {
      "id": "jazz",
      "name": "Jazz (We Got)",
      "type": "song",
      "references": [
        {
          "id": "jimmy_mcgriff",
          "name": "Jimmy McGriff",
          "type": "sample",
          "sample": "Green Dolphin Street"
        },
        {
          "id": "five_stairsteps",
          "name": "Five Stairsteps",
          "type": "sample",
          "sample": "Don't Change Your Love"
        },
        {
          "id": "the_doors",
          "name": "The Doors",
          "type": "sample",
          "sample": "Light My Fire"
        },
        {
          "id": "kid_capri",
          "name": "Kid Capri",
          "type": "shout",
        },
        {
          "id": "nwa",
          "name": "N.W.A.",
          "type": "shout",
        },
        {
          "id": "shabba_ranks",
          "name": "Shabba Ranks",
          "type": "shout",
        },
        {
          "id": "skeff_anselm",
          "name": "Skeff Anselm",
          "type": "shout",
        },
        {
          "id": "cameo",
          "name": "Cameo",
          "type": "shout",
        },
        {
          "id": "queen_latifah",
          "name": "Queen Latifah",
          "type": "shout",
        },
        {
          "id": "main_source",
          "name": "Main Source",
          "type": "shout",
        },
        {
          "id": "ll_cool_j",
          "name": "LL Cool J",
          "type": "shout",
        },
        {
          "id": "busta_rhymes",
          "name": "Busta Rhymes",
          "type": "shout",
        },
        {
          "id": "brand_nubians",
          "name": "Brand Nubians",
          "type": "shout",
        },
        {
          "id": "jungle_brothers",
          "name": "Jungle Brothers",
          "type": "shout",
        },
        {
          "id": "de_la_soul",
          "name": "De La Soul",
          "type": "shout",
        },
        {
          "id": "zulu_nation",
          "name": "Zulu Nation",
          "type": "shout"
        }
      ]
    },
    {
      "id": "sky_pager",
      "name": "Sky Pager",
      "type": "song",
      "references": [
        {
          "id": "sly_and_the_family_stone",
          "name": "Sly & the Family Stone",
          "type": "sample",
          "sample": "Advice"
        },
        {
          "id": "eric_dolphy",
          "name": "Eric Dolphy",
          "type": "sample",
          "sample": "17 West"
        }
      ]
    },
    {
      "id": "what",
      "name": "What?",
      "type": "song",
      "references": [
        {
          "id": "paul_humphrey",
          "name": "Paul Humphrey",
          "type": "sample",
          "sample": "Uncle Willie's Dream"
        },
        {
          "id": "oran_juice_jones",
          "name": "Oran 'Juice' Jones",
          "type": "shout",
        },
        {
          "id": "doug_e_fresh",
          "name": "Doug E Fresh",
          "type": "shout",
        },
        {
          "id": "duke_ellington",
          "name": "Duke Ellington",
          "type": "shout",
        },
        {
          "id": "doug_e_doug",
          "name": "Doug E Doug",
          "type": "shout",
        },
        {
          "id": "da_beatminerz",
          "name": "Da Beatminerz",
          "type": "shout",
        },
        {
          "id": "de_la_soul",
          "name": "De La Soul",
          "type": "shout",
        },
        {
          "id": "krs_one",
          "name": "KRS One",
          "type": "shout",
          "note": "Super Ho"
        }
      ]
    },
    {
      "id": "scenario",
      "name": "Scenario",
      "type": "song",
      "references": [
        {
          "id": "jimi_hendrix",
          "name": "Jimi Hendrix",
          "type": "sample",
          "sample": "Little Miss Lover"
        },
        {
          "id": "brother_jack_mcduff",
          "name": "Brother Jack McDuff",
          "type": "sample",
          "sample": "Oblighetto"
        },
        {
          "id": "leaders_of_the_new_school",
          "name": "Leaders of the New School",
          "type": "shout",
        },
        {
          "id": "grandmaster_flash",
          "name": "Grandmaster Flash",
          "type": "shout",
        },
        {
          "id": "bob_marley",
          "name": "Bob Marley",
          "type": "shout",
        },
        {
          "id": "zapp",
          "name": "Zapp",
          "type": "shout",
        },
        {
          "id": "peter_tosh",
          "name": "Peter Tosh",
          "type": "shout",
        },
        {
          "id": "zulu_nation",
          "name": "Zulu Nation",
          "type": "shout"
        },
        {
          "id": "busta_rhymes",
          "name": "Busta Rhymes",
          "type": "artist"
        },
        {
          "id": "charlie_brown",
          "name": "Charlie Brown",
          "type": "artist"
        },
        {
          "id": "dinco_d",
          "name": "Dinco D",
          "type": "artist"
        }
      ]
    }
  ]
};

const tribeData = {
  "nodes": [
    {
      "name": "Low End Theory",
      "id": "low-end-theory"
    }
  ]
};

const tribeNetwork = graph();

tribeNetwork("#vis", tribeData);
