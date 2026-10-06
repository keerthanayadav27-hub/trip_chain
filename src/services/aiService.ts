import { Activity, DayPlan, Trip, ActivityCategory } from '../types';

interface GenerationParams {
  destination: string;
  country?: string;
  startDate: string;
  endDate: string;
  totalBudget: number;
  interests: string[];
  currency?: string;
}

// Rich destination database for realistic itineraries
const DESTINATION_DATABASE: Record<string, {
  country: string;
  coverImage: string;
  days: Array<{
    theme: string;
    activities: Array<{
      time: string;
      title: string;
      description: string;
      location: string;
      category: ActivityCategory;
      cost: number;
      durationHours: number;
      highlight: string;
    }>;
  }>;
}> = {
  tokyo: {
    country: 'Japan',
    coverImage: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=1200&q=80',
    days: [
      {
        theme: 'Historic Shrines & Neon Shibuya Crossing',
        activities: [
          {
            time: '09:00 AM - 11:30 AM',
            title: 'Meiji Jingu Shrine & Yoyogi Forest Walk',
            description: 'Stroll through towering cypress torii gates and serene forest paths right in the heart of Tokyo.',
            location: 'Shibuya City, Tokyo',
            category: 'Culture',
            cost: 0,
            durationHours: 2.5,
            highlight: 'Traditional Shinto purification ritual & sake barrels display'
          },
          {
            time: '12:00 PM - 02:00 PM',
            title: 'Harajuku Takeshita Street & Artisanal Ramen',
            description: 'Taste authentic tonkotsu ramen at Afuri followed by freshly made Japanese crepes.',
            location: 'Harajuku, Shibuya',
            category: 'Food',
            cost: 25,
            durationHours: 2,
            highlight: 'Yuzu-scented broth & vibrant pop fashion culture'
          },
          {
            time: '02:30 PM - 05:30 PM',
            title: 'Shibuya Sky Observatory Deck',
            description: 'Panoramic 360-degree open-air rooftop views over Shibuya Crossing with Mount Fuji visible on clear days.',
            location: 'Shibuya Scramble Square',
            category: 'Sightseeing',
            cost: 22,
            durationHours: 3,
            highlight: 'Glass corner photo spot 229 meters above ground'
          },
          {
            time: '06:30 PM - 09:30 PM',
            title: 'Omoide Yokocho Izakaya Crawl & Yakitori',
            description: 'Atmospheric lantern-lit alleyways next to Shinjuku station serving sizzling chicken skewers and local beer.',
            location: 'Memory Lane, Shinjuku',
            category: 'Food',
            cost: 45,
            durationHours: 3,
            highlight: 'Charcoal grilled skewers in cozy 6-seat historic counters'
          }
        ]
      },
      {
        theme: 'Digital Arts, Old Asakusa & Akihabara Tech',
        activities: [
          {
            time: '09:30 AM - 12:00 PM',
            title: 'Sensō-ji Temple & Nakamise-dori Market',
            description: 'Tokyo’s oldest Buddhist temple founded in 645 AD. Sample freshly toasted melonpan and rice crackers.',
            location: 'Asakusa, Taito City',
            category: 'Culture',
            cost: 15,
            durationHours: 2.5,
            highlight: 'Massive red chochin lantern at Kaminarimon gate'
          },
          {
            time: '12:30 PM - 02:00 PM',
            title: 'Riverside Soba Noodles near Sumida River',
            description: 'Traditional buckwheat noodles served cold on bamboo mats with crispy seasonal vegetable tempura.',
            location: 'Sumida Park, Asakusa',
            category: 'Food',
            cost: 22,
            durationHours: 1.5,
            highlight: 'Overlooking the 634m Tokyo Skytree spire'
          },
          {
            time: '02:30 PM - 05:30 PM',
            title: 'teamLab Planets Immersive Digital Art',
            description: 'Wade barefoot through knee-deep water rooms with digital koi fish and endless crystal light installations.',
            location: 'Toyosu, Koto City',
            category: 'Activity',
            cost: 38,
            durationHours: 3,
            highlight: 'Floating in the Infinite Crystal Universe'
          },
          {
            time: '06:30 PM - 09:30 PM',
            title: 'Akihabara Retro Gaming & Maid Café Experience',
            description: 'Explore multi-story retro arcade halls at Super Potato and browse rare retro tech collectables.',
            location: 'Akihabara Electric Town',
            category: 'Nightlife',
            cost: 35,
            durationHours: 3,
            highlight: 'Multiplayer Mario Kart GP arcade tournament'
          }
        ]
      },
      {
        theme: 'Tsukiji Gastronomy & Roppongi Sky Lounge',
        activities: [
          {
            time: '08:30 AM - 11:30 AM',
            title: 'Tsukiji Outer Seafood Market Food Tour',
            description: 'Sample flame-torched wagyu skewers, sea urchin (uni) bowls, and sweet rolled tamagoyaki omelettes.',
            location: 'Tsukiji, Chuo City',
            category: 'Food',
            cost: 50,
            durationHours: 3,
            highlight: 'Freshly shucked Hokkaido scallops with butter soy'
          },
          {
            time: '12:30 PM - 03:30 PM',
            title: 'Imperial Palace Gardens & Ginza Boutiques',
            description: 'Walk along stone bridge Nijubashi and historic fortress moats, then stroll the pedestrian boulevard of Ginza.',
            location: 'Chiyoda & Ginza, Tokyo',
            category: 'Sightseeing',
            cost: 15,
            durationHours: 3,
            highlight: 'Edo Castle tenshudai stone foundation'
          },
          {
            time: '04:30 PM - 07:00 PM',
            title: 'Mori Art Museum & Roppongi Hills Views',
            description: 'Contemporary cutting-edge art exhibitions coupled with stunning Tokyo Tower illuminated twilight views.',
            location: 'Roppongi Hills Mori Tower',
            category: 'Culture',
            cost: 25,
            durationHours: 2.5,
            highlight: 'Direct vista of Tokyo Tower glowing crimson at sunset'
          },
          {
            time: '07:30 PM - 10:30 PM',
            title: 'Farewell Group Teppanyaki Dinner',
            description: 'Master chef grilling A5 Wagyu beef and seasonal seafood on an open teppan iron griddle.',
            location: 'Nishi-Azabu, Minato City',
            category: 'Food',
            cost: 85,
            durationHours: 3,
            highlight: 'Flame flambé demonstration & garlic fried rice finale'
          }
        ]
      }
    ]
  },
  paris: {
    country: 'France',
    coverImage: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=1200&q=80',
    days: [
      {
        theme: 'Classic Icons, Seine Cruise & Montmartre Sunset',
        activities: [
          {
            time: '09:00 AM - 11:30 AM',
            title: 'Eiffel Tower Summit & Champ de Mars Picnic',
            description: 'Ascend to the top deck of the Eiffel Tower followed by fresh croissants and espresso on the lawn.',
            location: 'Champ de Mars, 7th Arr.',
            category: 'Sightseeing',
            cost: 32,
            durationHours: 2.5,
            highlight: 'Panoramic rooftop view of Haussmannian avenues'
          },
          {
            time: '12:00 PM - 02:00 PM',
            title: 'Bistro Lunch at Café de Flore',
            description: 'Iconic Parisian café once frequented by Jean-Paul Sartre. Enjoy croque monsieur and café au lait.',
            location: 'Saint-Germain-des-Prés',
            category: 'Food',
            cost: 40,
            durationHours: 2,
            highlight: 'People-watching on Saint-Germain boulevard'
          },
          {
            time: '02:30 PM - 05:30 PM',
            title: 'Louvre Masterpieces & Tuileries Garden',
            description: 'Fast-track access to Mona Lisa, Winged Victory, and Venus de Milo, followed by a stroll through royal gardens.',
            location: 'Palais Royal, 1st Arr.',
            category: 'Culture',
            cost: 24,
            durationHours: 3,
            highlight: 'I.M. Pei Glass Pyramid reflecting the afternoon light'
          },
          {
            time: '06:30 PM - 09:30 PM',
            title: 'Montmartre Artists Square & Sacré-Cœur Sunset',
            description: 'Watch the sun sink over Paris from Sacré-Cœur steps, then enjoy fondue in bohemian alleyways.',
            location: 'Place du Tertre, Montmartre',
            category: 'Nightlife',
            cost: 55,
            durationHours: 3,
            highlight: 'Live accordion music and street portrait painters'
          }
        ]
      },
      {
        theme: 'Latin Quarter, Musée d’Orsay & Wine Tasting',
        activities: [
          {
            time: '09:30 AM - 12:00 PM',
            title: 'Musée d’Orsay Impressionist Treasures',
            description: 'Converted Beaux-Arts railway station housing masterpieces by Monet, Van Gogh, Renoir, and Degas.',
            location: '7th Arrondissement, Paris',
            category: 'Culture',
            cost: 20,
            durationHours: 2.5,
            highlight: 'Massive railway clock face overlooking the Seine'
          },
          {
            time: '12:30 PM - 02:30 PM',
            title: 'Latin Quarter Creperie & Shakespeare and Company',
            description: 'Authentic savory buckwheat galettes and sweet caramel crepes, then browse legendary English bookstore.',
            location: 'Latin Quarter, 5th Arr.',
            category: 'Food',
            cost: 26,
            durationHours: 2,
            highlight: 'Reading vintage poetry upstairs with Notre Dame view'
          },
          {
            time: '03:00 PM - 05:30 PM',
            title: 'Le Marais Architecture & Boutique Hunting',
            description: 'Stroll Place des Vosges, explore historic mansions, and taste gourmet macarons at Pierre Hermé.',
            location: 'Le Marais, 4th Arr.',
            category: 'Shopping',
            cost: 30,
            durationHours: 2.5,
            highlight: 'World-famous Ispahan rose & lychee macaron'
          },
          {
            time: '06:30 PM - 09:30 PM',
            title: 'Sommelier Natural Wine & Artisanal Cheese Tasting',
            description: 'Guided tasting of 5 biodynamic French wines paired with aged Comté, Camembert, and charcuterie.',
            location: 'Canal Saint-Martin',
            category: 'Food',
            cost: 65,
            durationHours: 3,
            highlight: 'Learning pairing secrets with local cave à vin expert'
          }
        ]
      },
      {
        theme: 'Versailles Grandeur & Seine Twilight Cruise',
        activities: [
          {
            time: '08:30 AM - 01:00 PM',
            title: 'Palace of Versailles Hall of Mirrors & Gardens',
            description: 'Tour the opulent Sun King palace, 357 mirrors reflecting gardens, and the musical fountains.',
            location: 'Versailles, Île-de-France',
            category: 'Culture',
            cost: 35,
            durationHours: 4.5,
            highlight: 'Grand Trianon & Marie Antoinette’s Queen’s Hamlet'
          },
          {
            time: '01:30 PM - 03:00 PM',
            title: 'French Brasserie Lunch in Versailles Town',
            description: 'Classic beef bourguignon and tarte tatin with local cider in a charming cobble-stoned square.',
            location: 'Place du Marché Notre-Dame',
            category: 'Food',
            cost: 35,
            durationHours: 1.5,
            highlight: 'Slow-simmered tender Pinot Noir beef stew'
          },
          {
            time: '04:00 PM - 06:30 PM',
            title: 'Sainte-Chapelle Stained Glass & Île de la Cité',
            description: '1,113 dazzling 13th-century stained glass windows towering 15 meters high telling biblical stories.',
            location: 'Île de la Cité',
            category: 'Sightseeing',
            cost: 16,
            durationHours: 2.5,
            highlight: 'Sunlight filtering ruby and sapphire through Gothic arches'
          },
          {
            time: '07:30 PM - 10:00 PM',
            title: 'Illuminated Seine River Champagne Cruise',
            description: 'Glide under historic Pont Neuf as the Eiffel Tower sparkles on the hour with a chilled flute of Champagne.',
            location: 'Pont de l’Alma Dock',
            category: 'Nightlife',
            cost: 50,
            durationHours: 2.5,
            highlight: 'The 20,000 flashbulbs sparkling on Eiffel Tower at 9 PM'
          }
        ]
      }
    ]
  },
  bali: {
    country: 'Indonesia',
    coverImage: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=1200&q=80',
    days: [
      {
        theme: 'Ubud Rice Terraces, Sacred Monkey Forest & Balinese Spa',
        activities: [
          {
            time: '08:30 AM - 11:30 AM',
            title: 'Tegalalang Rice Terraces & Jungle Swing',
            description: 'Trek through emerald layered rice paddies watered by ancient subak irrigation, then soar above the canopy.',
            location: 'Tegalalang, Ubud',
            category: 'Outdoor',
            cost: 20,
            durationHours: 3,
            highlight: 'Giant swing overlooking mist rising from the valley'
          },
          {
            time: '12:00 PM - 02:00 PM',
            title: 'Organic Farm-to-Table Lunch at Sari Organik',
            description: 'Crispy duck (Bebek Betutu), gado-gado, and fresh young coconut surrounded by lotus ponds.',
            location: 'Ubud Rice Fields',
            category: 'Food',
            cost: 18,
            durationHours: 2,
            highlight: 'Spiced slow-roasted duck wrapped in banana leaves'
          },
          {
            time: '02:30 PM - 05:00 PM',
            title: 'Sacred Monkey Forest Sanctuary & Royal Palace',
            description: 'Encounter over 1,000 long-tailed macaques among banyan trees and mossy moss-covered Hindu temples.',
            location: 'Padangtegal, Ubud',
            category: 'Culture',
            cost: 10,
            durationHours: 2.5,
            highlight: '14th-century dragon staircase carved into stone'
          },
          {
            time: '06:00 PM - 08:30 PM',
            title: 'Traditional Balinese Herbal Spa & Flower Bath',
            description: '90-minute Balinese massage with warm frangipani oil followed by a petal-filled therapeutic bath.',
            location: 'Jalan Raya Ubud',
            category: 'Activity',
            cost: 40,
            durationHours: 2.5,
            highlight: 'Exotic herbal body scrub and warm coconut oil therapy'
          }
        ]
      },
      {
        theme: 'Volcano Sunrise, Water Temples & Coffee Plantation',
        activities: [
          {
            time: '04:00 AM - 08:30 AM',
            title: 'Mount Batur Sunrise Jeep Trek',
            description: 'Ride 4x4 open-top jeeps across black volcanic lava sand dunes to witness dawn break over Mount Agung.',
            location: 'Kintamani, Bangli',
            category: 'Outdoor',
            cost: 55,
            durationHours: 4.5,
            highlight: 'Hot banana pancakes cooked over volcanic steam vents'
          },
          {
            time: '09:30 AM - 11:30 AM',
            title: 'Tirta Empul Holy Water Temple Purification',
            description: 'Participate in holy spring water cleansing ritual under 13 carved stone spouts in holy temple pools.',
            location: 'Tampak Siring, Gianyar',
            category: 'Culture',
            cost: 8,
            durationHours: 2,
            highlight: 'Traditional sarong cleansing blessing with temple priest'
          },
          {
            time: '12:30 PM - 03:00 PM',
            title: 'Luwak Coffee & Exotic Spice Garden Tasting',
            description: 'Sample 8 varieties of Bali coffee, wild ginger tea, and roasted cacao overlooking jungle valleys.',
            location: 'Sebatu Highlands',
            category: 'Food',
            cost: 15,
            durationHours: 2.5,
            highlight: 'Freshly roasted Robusta coffee beans brewed in clay pots'
          },
          {
            time: '04:00 PM - 07:30 PM',
            title: 'Tegenungan Waterfall Swim & Bamboo Sunset Club',
            description: 'Cool down in the natural pool beneath a cascading 15-meter waterfall, followed by cocktails.',
            location: 'Sukawati, Gianyar',
            category: 'Activity',
            cost: 25,
            durationHours: 3.5,
            highlight: 'Sunset cocktail overlooking rainforest canopy'
          }
        ]
      },
      {
        theme: 'Uluwatu Clifftops, Kecak Fire Dance & Jimbaran Seafood',
        activities: [
          {
            time: '09:00 AM - 12:30 PM',
            title: 'Padang Padang Surf Beach & Coastal Caves',
            description: 'Lounge on white sand enclosed by limestone cliffs where Eat Pray Love was filmed. Swim in turquoise waves.',
            location: 'Pecatu, South Kuta',
            category: 'Outdoor',
            cost: 5,
            durationHours: 3.5,
            highlight: 'Hidden tidal pools and coral reef snorkeling'
          },
          {
            time: '01:00 PM - 03:00 PM',
            title: 'Cliffside Clifftop Café Bowls & Smoothies',
            description: 'Dragonfruit smoothie bowls, grilled mahi-mahi tacos, and fresh lime iced tea with ocean vistas.',
            location: 'Uluwatu Cliffs',
            category: 'Food',
            cost: 20,
            durationHours: 2,
            highlight: '180-degree view of surfers carving world-famous barrels'
          },
          {
            time: '04:30 PM - 07:00 PM',
            title: 'Uluwatu Cliff Temple & Kecak Fire Sunset Dance',
            description: 'Watch 50 chanting men perform the dramatic Ramayana epic against a fiery sunset drop into the Indian Ocean.',
            location: 'Uluwatu Cliff, Pecatu',
            category: 'Culture',
            cost: 18,
            durationHours: 2.5,
            highlight: 'Hanuman white monkey acrobats kicking burning coconut husks'
          },
          {
            time: '07:30 PM - 10:00 PM',
            title: 'Jimbaran Bay Candlelight Grilled Seafood Feast',
            description: 'Dine with feet in the sand: grilled red snapper, jumbo king prawns, and calamari with sambal matah.',
            location: 'Jimbaran Bay Beach',
            category: 'Food',
            cost: 45,
            durationHours: 2.5,
            highlight: 'Candlelit tables directly on the tide line under stars'
          }
        ]
      }
    ]
  },
  'new york': {
    country: 'United States',
    coverImage: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?auto=format&fit=crop&w=1200&q=80',
    days: [
      {
        theme: 'Manhattan Skyline, Central Park & Broadway Lights',
        activities: [
          {
            time: '09:00 AM - 11:30 AM',
            title: 'Top of the Rock Observation Deck',
            description: 'Unobstructed view of the Empire State Building and Central Park from the 70th floor of Rockefeller Center.',
            location: 'Rockefeller Plaza, Midtown',
            category: 'Sightseeing',
            cost: 42,
            durationHours: 2.5,
            highlight: 'Sweeping direct view of Empire State Building'
          },
          {
            time: '12:00 PM - 02:00 PM',
            title: 'NYC Bagel Feast & Central Park Bow Bridge Walk',
            description: 'Ess-a-Bagel everything bagel with scallion cream cheese, followed by a stroll past Bethesda Fountain.',
            location: 'Central Park South',
            category: 'Food',
            cost: 20,
            durationHours: 2,
            highlight: 'Rowboats drifting under the romantic cast-iron Bow Bridge'
          },
          {
            time: '02:30 PM - 05:30 PM',
            title: 'Metropolitan Museum of Art (The Met)',
            description: 'Explore the Temple of Dendur, American Wing, and French Impressionist galleries.',
            location: '5th Avenue & 82nd St',
            category: 'Culture',
            cost: 30,
            durationHours: 3,
            highlight: 'Ancient Egyptian temple reflected in indoor pool'
          },
          {
            time: '07:00 PM - 10:30 PM',
            title: 'Broadway Musical & Junior’s Cheesecake',
            description: 'Catch an award-winning musical in the Theater District, followed by iconic New York cheesecake.',
            location: 'Times Square / Broadway',
            category: 'Nightlife',
            cost: 110,
            durationHours: 3.5,
            highlight: 'Orchestra seat energy and illuminated marquee signs'
          }
        ]
      },
      {
        theme: 'High Line, Chelsea Market & SoHo Style',
        activities: [
          {
            time: '09:30 AM - 11:30 AM',
            title: 'The High Line Elevated Park & Hudson Yards',
            description: 'Walk the repurposed historic freight rail line above Manhattan streets, ending at The Vessel.',
            location: 'Chelsea to Meatpacking District',
            category: 'Outdoor',
            cost: 0,
            durationHours: 2,
            highlight: 'Native wildflowers growing along vintage railroad tracks'
          },
          {
            time: '12:00 PM - 02:00 PM',
            title: 'Chelsea Market Food Hall Crawl',
            description: 'Sample Maine lobster rolls from Lobster Place, artisanal tacos from Los Tacos No. 1, and gelato.',
            location: '75 9th Ave, Chelsea',
            category: 'Food',
            cost: 35,
            durationHours: 2,
            highlight: 'Handmade corn tortilla carne asada tacos'
          },
          {
            time: '02:30 PM - 05:30 PM',
            title: 'SoHo Cast-Iron Architecture & Independent Boutiques',
            description: 'Cobblestone streets lined with world-famous cast-iron lofts, designer boutiques, and art galleries.',
            location: 'SoHo, Manhattan',
            category: 'Shopping',
            cost: 20,
            durationHours: 3,
            highlight: 'Historic architectural façades on Greene Street'
          },
          {
            time: '06:30 PM - 09:30 PM',
            title: 'Village Vanguard Historic Jazz Club',
            description: 'Descend the hallowed stairs into the most famous jazz basement in the world since 1935.',
            location: 'Greenwich Village',
            category: 'Nightlife',
            cost: 45,
            durationHours: 3,
            highlight: 'World-class live trumpet solos in intimate acoustics'
          }
        ]
      },
      {
        theme: 'Brooklyn Bridge, DUMBO Waterfront & Speakeasy',
        activities: [
          {
            time: '09:00 AM - 11:30 AM',
            title: 'Walking Across the Iconic Brooklyn Bridge',
            description: 'Walk across the Gothic arched wooden promenade above the East River as yellow cabs stream below.',
            location: 'Manhattan to Brooklyn',
            category: 'Sightseeing',
            cost: 0,
            durationHours: 2.5,
            highlight: 'Gothic stone arches framing Lower Manhattan skyline'
          },
          {
            time: '12:00 PM - 02:30 PM',
            title: 'Coal-Fired Pizza at Grimaldi’s & DUMBO Views',
            description: 'Crisp thin-crust mozzarella pie baked in an anthracite coal brick oven, followed by Washington St photo spot.',
            location: 'DUMBO, Brooklyn',
            category: 'Food',
            cost: 28,
            durationHours: 2.5,
            highlight: 'Manhattan Bridge framed between historic red brick warehouses'
          },
          {
            time: '03:00 PM - 05:30 PM',
            title: 'Brooklyn Heights Promenade & Jane’s Carousel',
            description: 'Leisurely stroll along the Esplanade with panoramic views of the Statue of Liberty and Governors Island.',
            location: 'Brooklyn Bridge Park',
            category: 'Outdoor',
            cost: 5,
            durationHours: 2.5,
            highlight: 'Restored 1922 carousel inside glass pavilion on the water'
          },
          {
            time: '07:00 PM - 10:30 PM',
            title: 'Secret NYC Speakeasy & Craft Cocktails',
            description: 'Enter through a vintage phone booth into an intimate craft cocktail den serving artisanal drinks.',
            location: 'East Village, Manhattan',
            category: 'Nightlife',
            cost: 65,
            durationHours: 3.5,
            highlight: 'Smoked bourbon old fashioned poured tableside'
          }
        ]
      }
    ]
  }
};

/**
 * Procedural generator for custom destinations not in the hardcoded list
 */
function generateProceduralDays(
  destination: string,
  country: string,
  totalBudget: number,
  interests: string[],
  startDateStr: string
): DayPlan[] {
  const day1Date = new Date(startDateStr || Date.now());
  const day2Date = new Date(day1Date);
  day2Date.setDate(day2Date.getDate() + 1);
  const day3Date = new Date(day1Date);
  day3Date.setDate(day3Date.getDate() + 2);

  const formatDate = (d: Date) => d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

  const perActivityBudget = Math.max(15, Math.floor(totalBudget / 12));

  return [
    {
      dayNumber: 1,
      date: formatDate(day1Date),
      theme: `Arrival & City Landmarks of ${destination}`,
      activities: [
        {
          id: 'act-1-1',
          time: '09:00 AM - 11:30 AM',
          title: `${destination} Historic City Center Walking Tour`,
          description: `Orient yourselves with a guided stroll past the central monuments, ancient squares, and architectural landmarks of ${destination}.`,
          location: `Old Town Square, ${destination}`,
          category: 'Culture',
          estimatedCost: Math.min(25, perActivityBudget),
          durationHours: 2.5,
          highlight: 'Local architectural secrets & history'
        },
        {
          id: 'act-1-2',
          time: '12:00 PM - 02:00 PM',
          title: `Traditional Lunch at Landmark Local Eatery`,
          description: `Savor signature regional specialties and seasonal dishes recommended by local culinary masters.`,
          location: `Market Quarter, ${destination}`,
          category: 'Food',
          estimatedCost: Math.round(perActivityBudget * 1.2),
          durationHours: 2,
          highlight: 'House specialty dish paired with local beverage'
        },
        {
          id: 'act-1-3',
          time: '02:30 PM - 05:30 PM',
          title: `${destination} Panoramic Viewpoint & Royal Gardens`,
          description: `Ascend to the highest natural or architectural lookout point for dramatic skyline photographs across the entire region.`,
          location: `Hilltop Promenade, ${destination}`,
          category: 'Sightseeing',
          estimatedCost: Math.min(20, perActivityBudget),
          durationHours: 3,
          highlight: 'Uninterrupted 360-degree vista at golden hour'
        },
        {
          id: 'act-1-4',
          time: '06:30 PM - 09:30 PM',
          title: `Evening Welcome Feast & Old Town Illumination`,
          description: `Gather for a vibrant dinner featuring regional live acoustic music, local wine or craft brews, and illuminated monument walks.`,
          location: `Riverside Promenade, ${destination}`,
          category: 'Nightlife',
          estimatedCost: Math.round(perActivityBudget * 1.5),
          durationHours: 3,
          highlight: 'Atmospheric lanterns and dessert tasting'
        }
      ]
    },
    {
      dayNumber: 2,
      date: formatDate(day2Date),
      theme: `Deep Dive into Art, Hidden Courtyards & Gastronomy`,
      activities: [
        {
          id: 'act-2-1',
          time: '09:30 AM - 12:00 PM',
          title: `Premier Art & Heritage Museum of ${destination}`,
          description: `Marvel at globally recognized classical masterworks and modern contemporary exhibits with skip-the-line entrance.`,
          location: `Museum Quarter, ${destination}`,
          category: 'Culture',
          estimatedCost: Math.min(30, perActivityBudget),
          durationHours: 2.5,
          highlight: 'Curated national treasures exhibit'
        },
        {
          id: 'act-2-2',
          time: '12:30 PM - 02:30 PM',
          title: `Artisanal Food Hall & Street Food Discovery`,
          description: `Taste a variety of small savory bites from independent vendors inside the city's bustling indoor market hall.`,
          location: `Grand Covered Bazaar, ${destination}`,
          category: 'Food',
          estimatedCost: perActivityBudget,
          durationHours: 2,
          highlight: 'Fresh pastries and local cheese selections'
        },
        {
          id: 'act-2-3',
          time: '03:00 PM - 05:30 PM',
          title: `Artisan Workshops & Boutique Walking District`,
          description: `Discover hidden courtyards, ceramicists, perfumers, and independent craft boutiques off the beaten tourist path.`,
          location: `Bohemian Quarter, ${destination}`,
          category: 'Shopping',
          estimatedCost: Math.min(15, perActivityBudget),
          durationHours: 2.5,
          highlight: 'Meeting local makers in their open studios'
        },
        {
          id: 'act-2-4',
          time: '06:30 PM - 09:30 PM',
          title: `Sunset Rooftop Tapas & Craft Beverages`,
          description: `Enjoy sunset drinks overlooking the roofs and steeples, accompanied by shareable chef small plates.`,
          location: `Rooftop Lounge, ${destination}`,
          category: 'Nightlife',
          estimatedCost: Math.round(perActivityBudget * 1.4),
          durationHours: 3,
          highlight: 'Sunset toast over the skyline'
        }
      ]
    },
    {
      dayNumber: 3,
      date: formatDate(day3Date),
      theme: `Scenic Nature, Active Adventure & Grand Farewell`,
      activities: [
        {
          id: 'act-3-1',
          time: '09:00 AM - 12:30 PM',
          title: `Scenic Nature Sanctuary & Coastal / Mountain Trail`,
          description: `Escape the urban bustle to trek along scenic ridges, lake trails, or picturesque rocky coastlines.`,
          location: `National Reserve, Outer ${destination}`,
          category: 'Outdoor',
          estimatedCost: Math.min(15, perActivityBudget),
          durationHours: 3.5,
          highlight: 'Wild scenic overlooks and fresh air'
        },
        {
          id: 'act-3-2',
          time: '01:00 PM - 02:30 PM',
          title: `Rustic Countryside Farmstead Lunch`,
          description: `Hearty meal prepared with ingredients harvested directly from surrounding organic farms and orchards.`,
          location: `Valley Inn, ${destination}`,
          category: 'Food',
          estimatedCost: perActivityBudget,
          durationHours: 1.5,
          highlight: 'Freshly baked hearth bread and farmhouse butter'
        },
        {
          id: 'act-3-3',
          time: '03:30 PM - 06:00 PM',
          title: `Historic Fortress or Castle Grounds Exploration`,
          description: `Walk the stone ramparts, subterranean vaults, and watchtowers with tales of historic legends and sieges.`,
          location: `Citadel Hill, ${destination}`,
          category: 'Culture',
          estimatedCost: Math.min(22, perActivityBudget),
          durationHours: 2.5,
          highlight: 'Medieval ramparts overlooking the valley'
        },
        {
          id: 'act-3-4',
          time: '07:30 PM - 10:30 PM',
          title: `Celebratory Group Farewell Dinner & Toast`,
          description: `An unforgettable final night tasting menu celebrating the shared adventure, memories, and group consensus.`,
          location: `Grand Dining Room, ${destination}`,
          category: 'Food',
          estimatedCost: Math.round(perActivityBudget * 1.8),
          durationHours: 3,
          highlight: 'Chef’s signature dessert and group toast'
        }
      ]
    }
  ];
}

/**
 * Main AI Itinerary Generator function
 */
export async function generateFullItinerary(params: GenerationParams): Promise<Trip> {
  // Simulate realistic AI thought and compilation latency (200ms)
  await new Promise(r => setTimeout(r, 200));

  const destKey = params.destination.trim().toLowerCase();
  const matched = DESTINATION_DATABASE[destKey];

  const startDateObj = new Date(params.startDate || '2026-10-15');
  const endDateObj = new Date(params.endDate || '2026-10-18');

  let days: DayPlan[];

  if (matched) {
    days = matched.days.map((d, dayIdx) => {
      const curDate = new Date(startDateObj);
      curDate.setDate(curDate.getDate() + dayIdx);
      const dateFormatted = curDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

      return {
        dayNumber: dayIdx + 1,
        date: dateFormatted,
        theme: d.theme,
        activities: d.activities.map((a, actIdx) => ({
          ...a,
          id: `act-${dayIdx + 1}-${actIdx + 1}`,
          estimatedCost: a.cost
        }))
      };
    });
  } else {
    days = generateProceduralDays(
      params.destination,
      params.country || 'Global',
      params.totalBudget,
      params.interests,
      params.startDate
    );
  }

  const tripId = `trip-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 6)}`;

  return {
    id: tripId,
    title: `Trip to ${params.destination}`,
    destination: params.destination,
    country: matched?.country || params.country || 'Global',
    startDate: params.startDate,
    endDate: params.endDate,
    totalBudget: params.totalBudget || 1500,
    interests: params.interests.length > 0 ? params.interests : ['Culture', 'Gastronomy', 'Sightseeing'],
    days,
    currency: params.currency || 'USD',
    coverImage: matched?.coverImage || 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=1200&q=80'
  };
}

/**
 * Regenerate an individual day plan independently with custom prompt tweaking
 */
export async function regenerateSingleDay(
  trip: Trip,
  dayNumber: number,
  customInstructions?: string
): Promise<DayPlan> {
  // Simulate AI generation delay
  await new Promise(r => setTimeout(r, 150));

  const existingDay = trip.days.find(d => d.dayNumber === dayNumber);
  const dateStr = existingDay?.date || `Day ${dayNumber}`;
  const promptLower = (customInstructions || '').toLowerCase();

  // Create customized activities based on user prompt
  const isBudgetPrompt = promptLower.includes('budget') || promptLower.includes('cheap') || promptLower.includes('free');
  const isFoodPrompt = promptLower.includes('food') || promptLower.includes('eat') || promptLower.includes('culinary') || promptLower.includes('ramen');
  const isNightlifePrompt = promptLower.includes('night') || promptLower.includes('bar') || promptLower.includes('club') || promptLower.includes('cocktail');
  const isOutdoorPrompt = promptLower.includes('outdoor') || promptLower.includes('nature') || promptLower.includes('hike') || promptLower.includes('beach');
  const isRelaxingPrompt = promptLower.includes('relax') || promptLower.includes('chill') || promptLower.includes('spa') || promptLower.includes('slow');

  let newTheme = `Day ${dayNumber}: Optimized ${trip.destination} Exploration`;
  const newActivities: Activity[] = [];

  if (isFoodPrompt) {
    newTheme = `Day ${dayNumber}: Ultimate Culinary & Gastronomy Safari`;
    newActivities.push(
      {
        id: `act-${dayNumber}-${Date.now()}-1`,
        time: '09:00 AM - 11:30 AM',
        title: `Breakfast Market Food Walk & Coffee Roastery`,
        description: `Begin the day with warm freshly baked pastries and single-origin pour-overs at a celebrated local roastery.`,
        location: `Old Market District, ${trip.destination}`,
        category: 'Food',
        estimatedCost: isBudgetPrompt ? 10 : 20,
        highlight: 'Freshly baked morning cinnamon knots & cold brew'
      },
      {
        id: `act-${dayNumber}-${Date.now()}-2`,
        time: '12:00 PM - 02:30 PM',
        title: `Hands-On Cooking Masterclass with Local Chef`,
        description: `Prepare 3 signature regional courses using fresh ingredients procured directly from local farm suppliers.`,
        location: `Culinary Studio, ${trip.destination}`,
        category: 'Food',
        estimatedCost: isBudgetPrompt ? 25 : 55,
        highlight: 'Mastering traditional spice blending techniques'
      },
      {
        id: `act-${dayNumber}-${Date.now()}-3`,
        time: '03:30 PM - 05:30 PM',
        title: `Artisanal Dessert & Tea Tasting Flight`,
        description: `Delight in miniature handmade tarts, chocolates, and regional loose-leaf teas in a peaceful courtyard.`,
        location: `Historic Arcade, ${trip.destination}`,
        category: 'Food',
        estimatedCost: 18,
        highlight: 'Chef’s seasonal fruit tart pairing'
      },
      {
        id: `act-${dayNumber}-${Date.now()}-4`,
        time: '07:00 PM - 10:00 PM',
        title: `Hidden Alleyway Izakaya & Street Food Crawl`,
        description: `Hop between 3 legendary neighborhood food stalls tasting skewered delights and local fermented specialties.`,
        location: `Lantern Alley, ${trip.destination}`,
        category: 'Nightlife',
        estimatedCost: isBudgetPrompt ? 25 : 45,
        highlight: 'Late-night noodles and smoky grilled specialties'
      }
    );
  } else if (isOutdoorPrompt) {
    newTheme = `Day ${dayNumber}: Scenic Open-Air Adventure & Wilderness`;
    newActivities.push(
      {
        id: `act-${dayNumber}-${Date.now()}-1`,
        time: '08:30 AM - 11:30 AM',
        title: `Sunrise Ridge Hike & Valley Lookout`,
        description: `Brisk morning hike along forest paths with panoramic views over the mountain ridges and glistening waterways.`,
        location: `Nature Reserve, ${trip.destination}`,
        category: 'Outdoor',
        estimatedCost: 5,
        highlight: 'Crisp morning air and panoramic ridge photos'
      },
      {
        id: `act-${dayNumber}-${Date.now()}-2`,
        time: '12:00 PM - 02:00 PM',
        title: `Lakeside Picnic & Artisan Sandwiches`,
        description: `Rest beside calm waters with locally sourced cheese, cured meats, fresh fruit, and crusty baguettes.`,
        location: `Shoreline Park, ${trip.destination}`,
        category: 'Food',
        estimatedCost: 15,
        highlight: 'Relaxing water views under shady pine trees'
      },
      {
        id: `act-${dayNumber}-${Date.now()}-3`,
        time: '02:30 PM - 05:30 PM',
        title: `Kayak or Bike Trail Expedition`,
        description: `Rent bikes or tandem kayaks to navigate scenic coastal paths and hidden wildlife coves.`,
        location: `Activity Center, ${trip.destination}`,
        category: 'Activity',
        estimatedCost: 28,
        highlight: 'Spotting native birds and secluded beaches'
      },
      {
        id: `act-${dayNumber}-${Date.now()}-4`,
        time: '06:30 PM - 09:30 PM',
        title: `Campfire Cookout & Stargazing Session`,
        description: `Wind down with hearty campfire chili, toasted marshmallows, and clear stargazing away from city light pollution.`,
        location: `Valley Campfire Ground, ${trip.destination}`,
        category: 'Outdoor',
        estimatedCost: 30,
        highlight: 'Identifying constellations with astronomical guide'
      }
    );
  } else if (isRelaxingPrompt) {
    newTheme = `Day ${dayNumber}: Mindful Wellness, Botanical Gardens & Slow Living`;
    newActivities.push(
      {
        id: `act-${dayNumber}-${Date.now()}-1`,
        time: '09:30 AM - 11:30 AM',
        title: `Botanical Greenhouse Walk & Morning Meditation`,
        description: `Wander through historic glasshouses filled with rare orchids, towering palm fronds, and tranquil fountains.`,
        location: `Royal Botanical Gardens, ${trip.destination}`,
        category: 'Outdoor',
        estimatedCost: 12,
        highlight: 'Lily pad pond and tropical conservatory'
      },
      {
        id: `act-${dayNumber}-${Date.now()}-2`,
        time: '12:00 PM - 02:00 PM',
        title: `Slow-Food Garden Café Lunch`,
        description: `Freshly picked salad greens, homemade quiche, and herbal lemonades served in an ivy-covered courtyard.`,
        location: `Garden Pavilion, ${trip.destination}`,
        category: 'Food',
        estimatedCost: 24,
        highlight: 'Lavender-infused honey dressing & warm brioche'
      },
      {
        id: `act-${dayNumber}-${Date.now()}-3`,
        time: '02:30 PM - 05:30 PM',
        title: `Thermal Baths & Hydrotherapy Circuit`,
        description: `Soak in natural mineral-rich thermal pools, aromatic steam saunas, and cold plunge waterfalls.`,
        location: `Ancient Bathhouse, ${trip.destination}`,
        category: 'Activity',
        estimatedCost: 45,
        highlight: 'Heated outdoor rooftop mineral bath'
      },
      {
        id: `act-${dayNumber}-${Date.now()}-4`,
        time: '06:30 PM - 09:30 PM',
        title: `Acoustic Chamber Concert & Candlelight Bistro`,
        description: `Gentle classical cello performance in a 16th-century chapel followed by a relaxing candlelit dinner.`,
        location: `Old Chapel & Bistro, ${trip.destination}`,
        category: 'Culture',
        estimatedCost: 50,
        highlight: 'Intimate candlelit acoustics and vintage red wine'
      }
    );
  } else {
    // Default smart refreshed itinerary for this day
    newTheme = `Day ${dayNumber}: Curated Culture & Local Life in ${trip.destination}`;
    newActivities.push(
      {
        id: `act-${dayNumber}-${Date.now()}-1`,
        time: '09:00 AM - 11:30 AM',
        title: `Neighborhood Artisanal Bakeries & Morning Walk`,
        description: `Discover hidden local bakeries and historic residential avenues bustling with neighborhood morning routine.`,
        location: `Historic Quarter, ${trip.destination}`,
        category: 'Culture',
        estimatedCost: 15,
        highlight: 'Warm freshly baked treats and local morning buzz'
      },
      {
        id: `act-${dayNumber}-${Date.now()}-2`,
        time: '12:00 PM - 02:30 PM',
        title: `Chef's Seasonal Tasting Platter`,
        description: `Enjoy a vibrant lunchtime sampler of local meats, farm cheeses, sourdough, and seasonal pickled vegetables.`,
        location: `Courtyard Tavern, ${trip.destination}`,
        category: 'Food',
        estimatedCost: 28,
        highlight: 'Directly sourced seasonal specialty dishes'
      },
      {
        id: `act-${dayNumber}-${Date.now()}-3`,
        time: '03:00 PM - 05:30 PM',
        title: `Interactive Contemporary Culture Center & Galleries`,
        description: `Explore multi-disciplinary art exhibits, interactive light projections, and local photography collections.`,
        location: `Arts Center, ${trip.destination}`,
        category: 'Sightseeing',
        estimatedCost: 22,
        highlight: 'Interactive light sculptures and artist talks'
      },
      {
        id: `act-${dayNumber}-${Date.now()}-4`,
        time: '06:30 PM - 09:30 PM',
        title: `Illuminated Skyline Walk & Jazz Lounge`,
        description: `Take in the evening city lights followed by warm live jazz and artisan cocktails in an intimate lounge.`,
        location: `Waterfront Jazz Den, ${trip.destination}`,
        category: 'Nightlife',
        estimatedCost: 40,
        highlight: 'Live saxophone quartet and skyline reflections'
      }
    );
  }

  return {
    dayNumber,
    date: dateStr,
    theme: newTheme,
    activities: newActivities
  };
}
