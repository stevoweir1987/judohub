import React, { useState } from 'react';
import { BookOpen, Award, Dumbbell, Play, ChevronRight, ChevronDown, Menu, X, FileText, ExternalLink } from 'lucide-react';
import InddViewer from './components/InddViewer';

const JudoTrainingApp = () => {
  const [activeTab, setActiveTab] = useState('techniques');
  const [expandedTechnique, setExpandedTechnique] = useState(null);
  const [expandedBelt, setExpandedBelt] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const techniques = {
    throws: [
      {
        name: "Uchi Mata (Inner Thigh Throw)",
        category: "Ashi-waza (Leg Techniques)",
        description: "A powerful throw where you sweep your opponent's inner thigh with your leg while pulling them forward and off-balance.",
        execution: [
          "Break opponent's balance forward and to their right",
          "Step in deeply with your right foot between opponent's legs",
          "Lift your left leg high, sweeping it into opponent's inner right thigh",
          "Pull strongly with both hands in a circular motion",
          "Drive through with your hips and complete the throw"
        ],
        videoId: "hIY6UvBJVYY",
        keyPoints: ["Deep entry", "High leg lift", "Strong kuzushi", "Hip drive"]
      },
      {
        name: "O Goshi (Major Hip Throw)",
        category: "Koshi-waza (Hip Techniques)",
        description: "A fundamental hip throw where you load your opponent onto your hip and throw them over.",
        execution: [
          "Pull opponent forward to break balance",
          "Step in with right foot in front of opponent's right foot",
          "Pivot on right foot, turning your back to opponent",
          "Wrap your right arm around opponent's waist",
          "Bend knees and pull opponent onto your hip",
          "Straighten legs and throw forward"
        ],
        videoId: "lTYU04TW0YQ",
        keyPoints: ["Low hip position", "Back to opponent", "Strong pull", "Explosive leg drive"]
      },
      {
        name: "Seoi Nage (Shoulder Throw)",
        category: "Te-waza (Hand Techniques)",
        description: "A classic shoulder throw where you pull opponent over your shoulder.",
        execution: [
          "Break opponent's balance forward",
          "Step in with right foot, turning to your left",
          "Pull opponent's right arm across your chest",
          "Drop your hips low, loading opponent onto your back",
          "Drive with legs and pull with arms to complete throw"
        ],
        videoId: "G7FwXPpPeco",
        keyPoints: ["Fast entry", "Low hips", "Arm control", "Strong pull"]
      },
      {
        name: "Osoto Gari (Major Outer Reap)",
        category: "Ashi-waza (Leg Techniques)",
        description: "A powerful leg reap where you sweep opponent's leg from behind.",
        execution: [
          "Push opponent backward to break balance",
          "Step forward with left foot outside opponent's right foot",
          "Swing right leg back and reap opponent's right leg",
          "Push opponent's upper body backward with chest and arms",
          "Continue driving through until opponent falls"
        ],
        videoId: "aFU3qH54TJE",
        keyPoints: ["Strong backward kuzushi", "Deep reap", "Chest contact", "Follow through"]
      },
      {
        name: "Tai Otoshi (Body Drop)",
        category: "Te-waza (Hand Techniques)",
        description: "A throw where you act as a block for opponent to fall over.",
        execution: [
          "Break opponent's balance forward and to their right",
          "Step across with right foot in front of opponent's right foot",
          "Keep right leg straight as a blocking bar",
          "Pull strongly with both arms in circular motion",
          "Rotate body and throw opponent over your leg"
        ],
        videoId: "bDW9dJLQFNk",
        keyPoints: ["Straight blocking leg", "Strong pull", "Timing", "Circular motion"]
      },
      {
        name: "Harai Goshi (Sweeping Hip Throw)",
        category: "Koshi-waza (Hip Techniques)",
        description: "A dynamic hip throw combined with a sweeping leg action.",
        execution: [
          "Pull opponent forward to break balance",
          "Step in deeply, turning your back to opponent",
          "Load opponent onto your hip",
          "Sweep your right leg back against opponent's legs",
          "Throw over your hip with sweeping action"
        ],
        videoId: "XPiMOgKXFMc",
        keyPoints: ["Hip contact", "Powerful sweep", "Timing", "Full rotation"]
      },
      {
        name: "Ko Uchi Gari (Minor Inner Reap)",
        category: "Ashi-waza (Leg Techniques)",
        description: "A small reaping technique targeting the opponent's heel.",
        execution: [
          "Push opponent to make them step back",
          "As they step back, attack the supporting leg",
          "Hook their heel with your foot from inside",
          "Pull upper body backward and down",
          "Reap leg away to complete throw"
        ],
        videoId: "wVDRy_OYKlE",
        keyPoints: ["Timing with step", "Hook the heel", "Upper body control", "Small movements"]
      }
    ],
    holds: [
      {
        name: "Kesa Gatame (Scarf Hold)",
        category: "Osaekomi-waza (Holding Techniques)",
        description: "A fundamental side control hold where you control opponent from the side.",
        execution: [
          "Position yourself perpendicular to opponent on their right side",
          "Thread your right arm under opponent's neck, gripping their collar or belt",
          "Grip opponent's right arm with your left hand near their elbow",
          "Spread your legs wide for base, right leg extended",
          "Press your chest down onto opponent's chest",
          "Keep your head low and hips heavy"
        ],
        videoId: "kJk5rzk4GWw",
        keyPoints: ["Wide base", "Heavy hips", "Arm control", "Chest pressure", "Low head position"]
      },
      {
        name: "Yoko Shiho Gatame (Side Four Corner Hold)",
        category: "Osaekomi-waza (Holding Techniques)",
        description: "A side control with four-point pressure on the opponent.",
        execution: [
          "Position on opponent's side, chest to chest",
          "Thread your right arm under opponent's neck, gripping their far collar",
          "Grip opponent's belt or pants with left hand near their hip",
          "Spread legs in a T-shape for stability",
          "Press chest weight down onto opponent",
          "Keep head on opposite side from legs"
        ],
        videoId: "kpnaWWJWzKI",
        keyPoints: ["T-position legs", "Chest pressure", "Head position", "Control far side"]
      },
      {
        name: "Kami Shiho Gatame (Upper Four Corner Hold)",
        category: "Osaekomi-waza (Holding Techniques)",
        description: "A hold from above opponent's head, controlling both shoulders.",
        execution: [
          "Position above opponent's head, facing their feet",
          "Hook your arms under both of opponent's arms",
          "Grip their belt on both sides",
          "Press your chest onto their chest/face area",
          "Spread your knees wide for stability",
          "Keep your hips low and heavy"
        ],
        videoId: "WwH4GfwjrOk",
        keyPoints: ["Control both arms", "Chest pressure", "Wide knee base", "Heavy hips"]
      },
      {
        name: "Tate Shiho Gatame (Vertical Four Corner Hold)",
        category: "Osaekomi-waza (Holding Techniques)",
        description: "A mount position controlling opponent from above.",
        execution: [
          "Sit on opponent's abdomen facing their head",
          "Hook your feet under opponent's legs or around their sides",
          "Control opponent's arms by pressing them to the mat",
          "Keep chest low and heavy on opponent",
          "Maintain balance with spread knees"
        ],
        videoId: "RfNVqQ2RVdE",
        keyPoints: ["High mount position", "Hook legs", "Arm control", "Balance"]
      }
    ],
    strangles: [
      {
        name: "Hadaka Jime (Naked Strangle)",
        category: "Shime-waza (Strangling Techniques)",
        description: "A rear naked choke applied from behind without using the gi.",
        execution: [
          "Position yourself behind opponent",
          "Slide your right arm around opponent's neck, deep under chin",
          "Connect your hands (right hand to left bicep)",
          "Place left hand behind opponent's head",
          "Squeeze by bringing elbows together",
          "Pull opponent backward slightly"
        ],
        videoId: "tvqCpHMYI4c",
        keyPoints: ["Deep under chin", "Squeeze elbows together", "Control the head", "Maintain back control"],
        warning: "Apply slowly and release immediately when opponent taps"
      },
      {
        name: "Okuri Eri Jime (Sliding Collar Strangle)",
        category: "Shime-waza (Strangling Techniques)",
        description: "A powerful strangle using both collar grips from behind.",
        execution: [
          "Get behind opponent with back control",
          "Grip opponent's right collar deep with your right hand, thumb inside",
          "Reach across with left hand, gripping left collar, thumb outside",
          "Pull right hand across their throat",
          "Pull left elbow back while pushing right hand forward",
          "Apply pressure by expanding chest"
        ],
        videoId: "xPrPEp0BwyM",
        keyPoints: ["Deep collar grips", "Cross-collar position", "Squeeze motion", "Back control"],
        warning: "Very powerful technique - apply with control"
      },
      {
        name: "Kata Ha Jime (Single Wing Strangle)",
        category: "Shime-waza (Strangling Techniques)",
        description: "A strangle using the collar and your shoulder/arm.",
        execution: [
          "Position behind opponent on their right side",
          "Grip opponent's left collar with right hand, deep and high",
          "Thread left arm under opponent's left armpit",
          "Grip your own right wrist or forearm with left hand",
          "Pull collar hand across throat while pulling other arm back",
          "Apply pressure by squeezing elbows together"
        ],
        videoId: "WaRO5E_yZFc",
        keyPoints: ["Deep collar grip", "Shoulder pressure", "Lock your grip", "Squeeze elbows"],
        warning: "Effective technique - monitor partner closely"
      },
      {
        name: "Nami Juji Jime (Normal Cross Strangle)",
        category: "Shime-waza (Strangling Techniques)",
        description: "A cross-collar strangle applied from the mount or guard.",
        execution: [
          "Start from mount or inside opponent's guard",
          "Grip opponent's right collar with your right hand, thumb inside, deep",
          "Grip opponent's left collar with left hand, thumb inside, deep",
          "Pull hands apart in opposite directions",
          "Press forearms against sides of neck",
          "Extend arms and squeeze"
        ],
        videoId: "tVkVEZuRVkM",
        keyPoints: ["Deep grips", "Cross pattern", "Forearm pressure", "Both thumbs inside"],
        warning: "Classic technique - apply steadily"
      }
    ]
  };

  const beltProgression = {
    toOrange: {
      name: "White to Orange Belt (9th to 8th Kyu)",
      duration: "Approximately 3-6 months",
      requirements: {
        throws: [
          "O Goshi (Major Hip Throw) - Demonstrate from both sides",
          "Uki Goshi (Floating Hip Throw)",
          "Ippon Seoi Nage (One-Arm Shoulder Throw)",
          "Deashi Barai (Advanced Foot Sweep)"
        ],
        holds: [
          "Kesa Gatame (Scarf Hold) - Hold for 25 seconds",
          "Yoko Shiho Gatame (Side Four Corner Hold) - Hold for 25 seconds",
          "Demonstrate escape from Kesa Gatame"
        ],
        strangles: [
          "Introduction to Hadaka Jime (Naked Strangle) - Understanding only",
          "Safety and tapping procedures"
        ],
        additional: [
          "Understand basic ukemi (breakfalls) on both sides",
          "Demonstrate forward and backward rolling",
          "Know basic judo etiquette and dojo rules",
          "Understand kuzushi (breaking balance) principles",
          "Basic randori (sparring) experience"
        ]
      }
    },
    orangeToGreen: {
      name: "Orange to Green Belt (8th to 7th Kyu)",
      duration: "Approximately 6 months",
      requirements: {
        throws: [
          "All previous throws plus:",
          "Osoto Gari (Major Outer Reap)",
          "Tai Otoshi (Body Drop)",
          "Ko Uchi Gari (Minor Inner Reap)",
          "Demonstrate combination attacks (renraku-waza)"
        ],
        holds: [
          "Kami Shiho Gatame (Upper Four Corner Hold)",
          "Transitions between different holds",
          "Demonstrate escapes from all basic holds"
        ],
        strangles: [
          "Okuri Eri Jime (Sliding Collar Strangle)",
          "Safe application and immediate release on tap"
        ],
        additional: [
          "Improved randori skills",
          "Counter techniques (kaeshi-waza) for basic throws",
          "Understanding of Ma-ai (distance) and timing"
        ]
      }
    },
    greenToBlue: {
      name: "Green to Blue Belt (7th to 6th Kyu)",
      duration: "Approximately 6-12 months",
      requirements: {
        throws: [
          "All previous throws refined",
          "Harai Goshi (Sweeping Hip Throw)",
          "Uchi Mata (Inner Thigh Throw)",
          "Sasae Tsurikomi Ashi (Propping Drawing Ankle)",
          "Competition-level execution of 5 tokui-waza (favorite techniques)"
        ],
        holds: [
          "Tate Shiho Gatame (Vertical Four Corner Hold)",
          "Advanced transitions and combinations",
          "Hold under resistance for 30 seconds"
        ],
        strangles: [
          "Kata Ha Jime (Single Wing Strangle)",
          "Nami Juji Jime (Normal Cross Strangle)",
          "Application from different positions"
        ],
        additional: [
          "Consistent randori performance",
          "Begin competing in tournaments",
          "Demonstrate teaching ability for beginners"
        ]
      }
    },
    blueToBrown: {
      name: "Blue to Brown Belt (6th to 3rd-1st Kyu)",
      duration: "Approximately 1-2 years",
      requirements: {
        throws: [
          "Mastery of all previous techniques",
          "Advanced ashi-waza (leg techniques)",
          "Sutemi-waza (sacrifice techniques)",
          "Effective tokui-waza in competition",
          "Demonstrate Nage-no-Kata (Forms of Throwing)"
        ],
        holds: [
          "All holds with seamless transitions",
          "Advanced escape techniques",
          "Turtle position attacks"
        ],
        strangles: [
          "All basic strangles plus variations",
          "Gyaku Juji Jime (Reverse Cross Strangle)",
          "Combination attacks from various positions"
        ],
        additional: [
          "Regular competition participation",
          "Tournament wins or strong placements",
          "Teaching experience with junior students",
          "Deep understanding of judo principles"
        ]
      }
    },
    brownToBlack: {
      name: "Brown to Black Belt (1st Kyu to 1st Dan)",
      duration: "Approximately 1-3 years minimum",
      requirements: {
        throws: [
          "Expert execution of all 40 throws from Gokyo",
          "Multiple tokui-waza at competition level",
          "Demonstrate complete Nage-no-Kata perfectly",
          "Katame-no-Kata (Forms of Grappling)"
        ],
        holds: [
          "Mastery of all osaekomi-waza",
          "Advanced ne-waza (groundwork) strategy",
          "Teaching progression for all holds"
        ],
        strangles: [
          "Complete understanding of all shime-waza",
          "Safe and effective application under pressure",
          "Competition experience using strangles"
        ],
        additional: [
          "Minimum age typically 16-18 years",
          "100+ hours of formal instruction",
          "Significant competition experience",
          "Demonstrate all aspects of Kodokan Judo",
          "Written test on judo history and philosophy",
          "Teaching capability and leadership",
          "Exemplary character and sportsmanship"
        ]
      }
    }
  };

  const trainingPrograms = {
    beginner: {
      name: "Beginner Home Training (White to Orange Belt)",
      weeks: [
        {
          day: "Monday",
          exercises: [
            "Warm-up: 10 min jogging or jumping jacks",
            "Ukemi practice: 20 forward rolls, 20 backward rolls (10 each side)",
            "Uchi-komi (entry practice) with band: 30 reps O Goshi, 30 reps Seoi Nage",
            "Core work: 3 sets of 20 sit-ups, 20 bicycle crunches",
            "Stretching: 15 minutes flexibility work"
          ]
        },
        {
          day: "Tuesday",
          exercises: [
            "Rest or light cardio: 30 min walk or bike",
            "Visualization: 20 min watching technique videos and mentally practicing",
            "Stretching: 20 minutes yoga or flexibility"
          ]
        },
        {
          day: "Wednesday",
          exercises: [
            "Warm-up: 10 min jump rope",
            "Strength: 3 sets of 10 push-ups, 3 sets of 15 squats, 3 sets of 10 pull-ups (assisted if needed)",
            "Uchi-komi with band: 20 reps each - Tai Otoshi, Osoto Gari, Uchi Mata",
            "Shadow randori: 15 minutes practicing movement and entries",
            "Cool down: 10 min stretching"
          ]
        },
        {
          day: "Thursday",
          exercises: [
            "Dojo Training Day - Focus on live practice",
            "Evening: Light stretching and recovery"
          ]
        },
        {
          day: "Friday",
          exercises: [
            "Warm-up: 10 min cardio",
            "Breakfall practice: 15 each side, forward and backward",
            "Grip strength training: Gi pull-ups or towel hangs - 3 sets",
            "Core circuit: 3 rounds of 30 sec plank, 15 leg raises, 20 Russian twists",
            "Stretching: 15 minutes"
          ]
        },
        {
          day: "Saturday",
          exercises: [
            "Dojo Training Day - Randori focus",
            "Post-training: Ice bath or contrast shower for recovery"
          ]
        },
        {
          day: "Sunday",
          exercises: [
            "Active recovery: Light swimming, walking, or yoga",
            "Study: Watch competition footage, read judo materials",
            "Meal prep for the week"
          ]
        }
      ],
      equipment: [
        "Resistance band or bungee cord for uchi-komi",
        "Pull-up bar or sturdy bar",
        "Exercise mat",
        "Jump rope",
        "Timer/stopwatch"
      ],
      tips: [
        "Always warm up properly before training",
        "Focus on perfect technique, not speed initially",
        "Practice breakfalls on appropriate surfaces only",
        "Stay hydrated throughout training",
        "Get 8+ hours of sleep for recovery",
        "Maintain a balanced diet with adequate protein"
      ]
    },
    intermediate: {
      name: "Intermediate Home Training (Green to Brown Belt)",
      weeks: [
        {
          day: "Monday",
          exercises: [
            "Warm-up: 15 min running with interval sprints",
            "Uchi-komi intensive: 50 reps each of your 3 tokui-waza with band",
            "Strength circuit: 4 sets - 15 push-ups, 20 squats, 12 pull-ups, 30 sec plank",
            "Shadow randori: 20 minutes with intensity",
            "Core finisher: 4 sets of 25 sit-ups, 20 leg raises, 30 Russian twists",
            "Stretching: 20 minutes"
          ]
        },
        {
          day: "Tuesday",
          exercises: [
            "Cardio: 45 min run or 30 min HIIT training",
            "Grip strength: Gi pull-ups 4 sets to failure",
            "Towel hangs: 3 sets of max time",
            "Visualization and video study: 30 minutes",
            "Yoga or mobility work: 30 minutes"
          ]
        },
        {
          day: "Wednesday",
          exercises: [
            "Warm-up: 10 min jump rope",
            "Explosive training: Box jumps 4x10, Burpees 4x15",
            "Uchi-komi with resistance: 40 reps each of 5 different throws",
            "Ne-waza drilling solo: 20 minutes transitions and escapes",
            "Strength: Deadlifts or weighted squats 4 sets of 8",
            "Cool down: 15 min stretching"
          ]
        },
        {
          day: "Thursday",
          exercises: [
            "Dojo Training Day - Technical drilling",
            "Evening: Recovery work, foam rolling, stretching"
          ]
        },
        {
          day: "Friday",
          exercises: [
            "Warm-up: 15 min cardio",
            "Power training: Medicine ball throws, resistance band work",
            "Competition simulation: 5 rounds of 4 min shadow randori",
            "Core circuit: 5 rounds maximum effort",
            "Grip endurance: Farmer's carries, plate pinches",
            "Stretching: 20 minutes"
          ]
        },
        {
          day: "Saturday",
          exercises: [
            "Dojo Training Day - Randori intensive",
            "Post-training: Proper cool down and recovery protocol"
          ]
        },
        {
          day: "Sunday",
          exercises: [
            "Active recovery: Swimming, cycling, or hiking",
            "Competition footage analysis: 1 hour",
            "Meal prep and nutrition planning",
            "Mental training: Visualization and meditation"
          ]
        }
      ],
      equipment: [
        "Heavy resistance bands",
        "Pull-up bar with gi attached",
        "Exercise mat",
        "Jump rope",
        "Medicine ball",
        "Weight plates or dumbbells",
        "Foam roller",
        "Timer/stopwatch"
      ],
      tips: [
        "Train with purpose - every session should have specific goals",
        "Track your progress in a training journal",
        "Increase intensity gradually to avoid injury",
        "Prioritize recovery - it's when you actually improve",
        "Work with partners when possible for realistic drilling",
        "Study elite competitors in your weight class",
        "Focus on your tokui-waza until they're unstoppable"
      ]
    }
  };

  const TechniqueCard = ({ technique, type }) => {
    const isExpanded = expandedTechnique === technique.name;
    
    return (
      <div className="border border-gray-700 rounded-lg mb-4 bg-gray-800">
        <button
          onClick={() => setExpandedTechnique(isExpanded ? null : technique.name)}
          className="w-full p-4 flex justify-between items-center hover:bg-gray-750 transition-colors"
        >
          <div className="text-left">
            <h3 className="font-bold text-white text-lg">{technique.name}</h3>
            <p className="text-sm text-gray-400">{technique.category}</p>
          </div>
          {isExpanded ? <ChevronDown className="text-blue-400" /> : <ChevronRight className="text-blue-400" />}
        </button>
        
        {isExpanded && (
          <div className="p-4 border-t border-gray-700 space-y-4">
            <p className="text-gray-300">{technique.description}</p>
            
            <div>
              <h4 className="font-semibold text-white mb-2 flex items-center">
                <BookOpen size={16} className="mr-2 text-blue-400" />
                Step-by-Step Execution
              </h4>
              <ol className="space-y-2">
                {technique.execution.map((step, idx) => (
                  <li key={idx} className="text-gray-300 ml-4">
                    <span className="font-semibold text-blue-400">{idx + 1}.</span> {step}
                  </li>
                ))}
              </ol>
            </div>

            <div>
              <h4 className="font-semibold text-white mb-2">Key Points to Remember</h4>
              <div className="flex flex-wrap gap-2">
                {technique.keyPoints.map((point, idx) => (
                  <span key={idx} className="bg-blue-900 text-blue-200 px-3 py-1 rounded-full text-sm">
                    {point}
                  </span>
                ))}
              </div>
            </div>

            {technique.warning && (
              <div className="bg-red-900 bg-opacity-30 border border-red-700 rounded p-3">
                <p className="text-red-300 text-sm font-semibold">⚠️ Safety Warning: {technique.warning}</p>
              </div>
            )}

            {technique.videoId && (
              <div>
                <h4 className="font-semibold text-white mb-2 flex items-center">
                  <Play size={16} className="mr-2 text-red-500" />
                  Video Demonstration
                </h4>
                <div className="relative" style={{ paddingBottom: '56.25%', height: 0 }}>
                  <iframe
                    src={`https://www.youtube.com/embed/${technique.videoId}`}
                    className="absolute top-0 left-0 w-full h-full rounded"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    title={technique.name}
                  />
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  const BeltProgressionCard = ({ beltData, beltKey }) => {
    const isExpanded = expandedBelt === beltKey;
    
    return (
      <div className="border border-gray-700 rounded-lg mb-4 bg-gray-800">
        <button
          onClick={() => setExpandedBelt(isExpanded ? null : beltKey)}
          className="w-full p-4 flex justify-between items-center hover:bg-gray-750 transition-colors"
        >
          <div className="text-left">
            <h3 className="font-bold text-white text-lg">{beltData.name}</h3>
            <p className="text-sm text-gray-400">{beltData.duration}</p>
          </div>
          {isExpanded ? <ChevronDown className="text-blue-400" /> : <ChevronRight className="text-blue-400" />}
        </button>
        
        {isExpanded && (
          <div className="p-4 border-t border-gray-700 space-y-4">
            <div>
              <h4 className="font-semibold text-yellow-400 mb-2 text-lg">Required Throws</h4>
              <ul className="space-y-1">
                {beltData.requirements.throws.map((throw_item, idx) => (
                  <li key={idx} className="text-gray-300 ml-4 flex items-start">
                    <span className="text-blue-400 mr-2">•</span>
                    {throw_item}
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-green-400 mb-2 text-lg">Required Holds</h4>
              <ul className="space-y-1">
                {beltData.requirements.holds.map((hold, idx) => (
                  <li key={idx} className="text-gray-300 ml-4 flex items-start">
                    <span className="text-blue-400 mr-2">•</span>
                    {hold}
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-red-400 mb-2 text-lg">Required Strangles/Chokes</h4>
              <ul className="space-y-1">
                {beltData.requirements.strangles.map((strangle, idx) => (
                  <li key={idx} className="text-gray-300 ml-4 flex items-start">
                    <span className="text-blue-400 mr-2">•</span>
                    {strangle}
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-purple-400 mb-2 text-lg">Additional Requirements</h4>
              <ul className="space-y-1">
                {beltData.requirements.additional.map((req, idx) => (
                  <li key={idx} className="text-gray-300 ml-4 flex items-start">
                    <span className="text-blue-400 mr-2">•</span>
                    {req}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>
    );
  };

  const tabs = [
    { id: 'techniques', label: 'Techniques', icon: BookOpen },
    { id: 'progression', label: 'Belt Progression', icon: Award },
    { id: 'syllabus', label: 'Official Syllabus', icon: FileText },
    { id: 'indd', label: 'Interactive Documents', icon: ExternalLink },
    { id: 'training', label: 'Daily Training', icon: Dumbbell }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 text-white">
      {/* Header */}
      <header className="bg-gray-800 shadow-lg border-b border-blue-700">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl md:text-3xl font-bold text-blue-400">🥋 Judo Training Hub</h1>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden text-white"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </header>

      {/* Navigation */}
      <nav className={`bg-gray-800 border-b border-gray-700 ${mobileMenuOpen ? 'block' : 'hidden'} md:block`}>
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col md:flex-row md:space-x-1">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveTab(tab.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`flex items-center px-6 py-4 font-semibold transition-colors ${
                    activeTab === tab.id
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-300 hover:bg-gray-700'
                  }`}
                >
                  <Icon size={20} className="mr-2" />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Techniques Tab */}
        {activeTab === 'techniques' && (
          <div>
            <div className="mb-8">
              <h2 className="text-3xl font-bold mb-2 text-blue-400">Judo Techniques Library</h2>
              <p className="text-gray-300">Comprehensive guide to fundamental judo techniques with video demonstrations</p>
            </div>

            <div className="space-y-8">
              <section>
                <h3 className="text-2xl font-bold mb-4 text-yellow-400 flex items-center">
                  <span className="bg-yellow-600 rounded-full w-8 h-8 flex items-center justify-center mr-3 text-sm">T</span>
                  Throws (Nage-waza)
                </h3>
                {techniques.throws.map((technique) => (
                  <TechniqueCard key={technique.name} technique={technique} type="throw" />
                ))}
              </section>

              <section>
                <h3 className="text-2xl font-bold mb-4 text-green-400 flex items-center">
                  <span className="bg-green-600 rounded-full w-8 h-8 flex items-center justify-center mr-3 text-sm">H</span>
                  Holds (Osaekomi-waza)
                </h3>
                {techniques.holds.map((technique) => (
                  <TechniqueCard key={technique.name} technique={technique} type="hold" />
                ))}
              </section>

              <section>
                <h3 className="text-2xl font-bold mb-4 text-red-400 flex items-center">
                  <span className="bg-red-600 rounded-full w-8 h-8 flex items-center justify-center mr-3 text-sm">S</span>
                  Strangles (Shime-waza)
                </h3>
                <div className="bg-red-900 bg-opacity-30 border border-red-700 rounded-lg p-4 mb-4">
                  <p className="text-red-300 font-semibold">⚠️ Important Safety Notice</p>
                  <p className="text-red-200 text-sm mt-2">
                    Strangulation techniques must only be practiced under qualified supervision. Always tap immediately when pressure is felt, and release immediately when your partner taps. Never practice these techniques without proper instruction.
                  </p>
                </div>
                {techniques.strangles.map((technique) => (
                  <TechniqueCard key={technique.name} technique={technique} type="strangle" />
                ))}
              </section>
            </div>
          </div>
        )}

        {/* Belt Progression Tab */}
        {activeTab === 'progression' && (
          <div>
            <div className="mb-8">
              <h2 className="text-3xl font-bold mb-2 text-blue-400">Belt Progression Path</h2>
              <p className="text-gray-300">Requirements and expectations for each rank advancement</p>
            </div>

            <div className="bg-blue-900 bg-opacity-30 border border-blue-700 rounded-lg p-4 mb-6">
              <h3 className="font-semibold text-blue-300 mb-2">About Belt Rankings</h3>
              <p className="text-gray-300 text-sm">
                Judo uses a kyu/dan system. Students progress through kyu grades (colored belts) from white to brown, then earn dan grades (black belt degrees). Requirements may vary by organization and country. These are general guidelines based on traditional Kodokan standards.
              </p>
            </div>

            <div className="space-y-4">
              <BeltProgressionCard beltData={beltProgression.toOrange} beltKey="toOrange" />
              <BeltProgressionCard beltData={beltProgression.orangeToGreen} beltKey="orangeToGreen" />
              <BeltProgressionCard beltData={beltProgression.greenToBlue} beltKey="greenToBlue" />
              <BeltProgressionCard beltData={beltProgression.blueToBrown} beltKey="blueToBrown" />
              <BeltProgressionCard beltData={beltProgression.brownToBlack} beltKey="brownToBlack" />
            </div>

            <div className="mt-8 bg-gray-800 border border-gray-700 rounded-lg p-6">
              <h3 className="text-xl font-bold text-white mb-3">General Training Timeline</h3>
              <div className="space-y-2 text-gray-300">
                <p><strong className="text-blue-400">White to Orange:</strong> 3-6 months of consistent training</p>
                <p><strong className="text-green-400">Orange to Green:</strong> 6 additional months</p>
                <p><strong className="text-cyan-400">Green to Blue:</strong> 6-12 additional months</p>
                <p><strong className="text-yellow-400">Blue to Brown:</strong> 1-2 additional years</p>
                <p><strong className="text-purple-400">Brown to Black:</strong> 1-3 additional years minimum</p>
                <p className="mt-4 pt-4 border-t border-gray-700 text-sm">
                  <strong>Total time to Black Belt:</strong> Typically 4-7 years of dedicated training, though this varies greatly based on training frequency, natural aptitude, and organization standards.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Training Tab */}
        {activeTab === 'training' && (
          <div>
            <div className="mb-8">
              <h2 className="text-3xl font-bold mb-2 text-blue-400">Daily Training Programs</h2>
              <p className="text-gray-300">Structured home training plans to supplement your dojo practice</p>
            </div>

            <div className="space-y-8">
              {/* Beginner Program */}
              <section className="bg-gray-800 rounded-lg border border-gray-70 p-6">
                <h3 className="text-2xl font-bold mb-4 text-green-400">{trainingPrograms.beginner.name}</h3>
                
                <div className="mb-6">
                  <h4 className="font-semibold text-white mb-3">Weekly Training Schedule</h4>
                  <div className="space-y-4">
                    {trainingPrograms.beginner.weeks.map((day, idx) => (
                      <div key={idx} className="bg-gray-900 rounded p-4">
                        <h5 className="font-bold text-blue-400 mb-2">{day.day}</h5>
                        <ul className="space-y-1">
                          {day.exercises.map((exercise, exIdx) => (
                            <li key={exIdx} className="text-gray-300 text-sm ml-4 flex items-start">
                              <span className="text-blue-40 mr-2">•</span>
                              {exercise}
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mb-6">
                  <h4 className="font-semibold text-white mb-3">Required Equipment</h4>
                  <div className="flex flex-wrap gap-2">
                    {trainingPrograms.beginner.equipment.map((item, idx) => (
                      <span key={idx} className="bg-blue-900 text-blue-200 px-3 py-1 rounded-full text-sm">
                        {item}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-white mb-3">Training Tips</h4>
                  <ul className="space-y-2">
                    {trainingPrograms.beginner.tips.map((tip, idx) => (
                      <li key={idx} className="text-gray-300 text-sm ml-4 flex items-start">
                        <span className="text-green-400 mr-2">✓</span>
                        {tip}
                      </li>
                    ))}
                  </ul>
                </div>
              </section>

              {/* Intermediate/Advanced Program */}
              <section className="bg-gray-800 rounded-lg border border-gray-700 p-6">
                <h3 className="text-2xl font-bold mb-4 text-yellow-400">{trainingPrograms.intermediate.name}</h3>
                
                <div className="mb-6">
                  <h4 className="font-semibold text-white mb-3">Weekly Training Schedule</h4>
                  <div className="space-y-4">
                    {trainingPrograms.intermediate.weeks.map((day, idx) => (
                      <div key={idx} className="bg-gray-900 rounded p-4">
                        <h5 className="font-bold text-yellow-400 mb-2">{day.day}</h5>
                        <ul className="space-y-1">
                          {day.exercises.map((exercise, exIdx) => (
                            <li key={exIdx} className="text-gray-300 text-sm ml-4 flex items-start">
                              <span className="text-yellow-400 mr-2">•</span>
                              {exercise}
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mb-6">
                  <h4 className="font-semibold text-white mb-3">Required Equipment</h4>
                  <div className="flex flex-wrap gap-2">
                    {trainingPrograms.intermediate.equipment.map((item, idx) => (
                      <span key={idx} className="bg-yellow-900 text-yellow-200 px-3 py-1 rounded-full text-sm">
                        {item}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-white mb-3">Training Tips</h4>
                  <ul className="space-y-2">
                    {trainingPrograms.intermediate.tips.map((tip, idx) => (
                      <li key={idx} className="text-gray-300 text-sm ml-4 flex items-start">
                        <span className="text-yellow-400 mr-2">✓</span>
                        {tip}
                      </li>
                    ))}
                  </ul>
                </div>
              </section>

              {/* General Training Principles */}
              <section className="bg-gradient-to-r from-blue-900 to-purple-900 rounded-lg border border-blue-700 p-6">
                <h3 className="text-2xl font-bold mb-4 text-white">Universal Training Principles</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="bg-black bg-opacity-30 rounded p-4">
                    <h4 className="font-bold text-blue-300 mb-2">Physical Conditioning</h4>
                    <p className="text-gray-300 text-sm">Judo requires explosive power, endurance, and flexibility. Focus on compound movements, cardiovascular fitness, and daily stretching.</p>
                  </div>
                  <div className="bg-black bg-opacity-30 rounded p-4">
                    <h4 className="font-bold text-green-300 mb-2">Technical Practice</h4>
                    <p className="text-gray-300 text-sm">Uchi-komi (repetitive entry practice) is essential. Aim for 1000+ reps per week of your tokui-waza (favorite techniques).</p>
                  </div>
                  <div className="bg-black bg-opacity-30 rounded p-4">
                    <h4 className="font-bold text-yellow-300 mb-2">Recovery & Nutrition</h4>
                    <p className="text-gray-30 text-sm">Adequate sleep, proper nutrition, and active recovery are crucial. Train hard, but recover harder.</p>
                  </div>
                  <div className="bg-black bg-opacity-30 rounded p-4">
                    <h4 className="font-bold text-purple-300 mb-2">Mental Training</h4>
                    <p className="text-gray-30 text-sm">Visualization, studying competition footage, and meditation improve performance. The mental game is half the battle.</p>
                  </div>
                </div>
              </section>
            </div>
          </div>
        )}

        {/* Syllabus Tab */}
        {activeTab === 'syllabus' && (
          <div>
            <div className="mb-8">
              <h2 className="text-3xl font-bold mb-2 text-blue-400">Official BJA Syllabus</h2>
              <p className="text-gray-300">Interactive access to official British Judo Association grading requirements</p>
            </div>

            <div className="space-y-8">
              <section>
                <h3 className="text-2xl font-bold mb-4 text-yellow-400">6th Kyu to 5th Kyu Syllabus</h3>
                <p className="text-gray-300 mb-4">Requirements for advancement from white to yellow belt</p>
                <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
                  <div className="flex justify-center">
                    <iframe 
                      src={`${process.env.PUBLIC_URL}/6th-Kyu-5th-Kyu.pdf`} 
                      className="w-full h-96 border-gray-600 rounded"
                      title="6th Kyu to 5th Kyu Syllabus"
                      type="application/pdf"
                    >
                      <p>Your browser doesn't support PDF viewing. <a href={`${process.env.PUBLIC_URL}/6th-Kyu-5th-Kyu.pdf`} className="text-blue-400 hover:underline">Download the PDF</a> instead.</p>
                    </iframe>
                  </div>
                </div>
              </section>

              <section>
                <h3 className="text-2xl font-bold mb-4 text-green-400">5th Kyu to 4th Kyu Syllabus</h3>
                <p className="text-gray-30 mb-4">Requirements for advancement from yellow to orange belt</p>
                <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
                  <div className="flex justify-center">
                    <iframe 
                      src={`${process.env.PUBLIC_URL}/5th-Kyu-4th-Kyu.pdf`} 
                      className="w-full h-96 border-gray-600 rounded"
                      title="5th Kyu to 4th Kyu Syllabus"
                      type="application/pdf"
                    >
                      <p>Your browser doesn't support PDF viewing. <a href={`${process.env.PUBLIC_URL}/5th-Kyu-4th-Kyu.pdf`} className="text-blue-400 hover:underline">Download the PDF</a> instead.</p>
                    </iframe>
                  </div>
                </div>
              </section>

              <section>
                <h3 className="text-2xl font-bold mb-4 text-blue-400">Complete Kyu Syllabus</h3>
                <p className="text-gray-300 mb-4">Full syllabus from 6th Kyu to 4th Kyu</p>
                <div className="bg-gray-800 rounded-lg border-gray-70 p-6">
                  <div className="flex justify-center">
                    <iframe 
                      src={`${process.env.PUBLIC_URL}/02-Kyu-Syllabus-6th-Kyu-5th-Kyu.pdf`} 
                      className="w-full h-96 border-gray-60 rounded"
                      title="Complete 6th Kyu to 5th Kyu Syllabus"
                      type="application/pdf"
                    >
                      <p>Your browser doesn't support PDF viewing. <a href={`${process.env.PUBLIC_URL}/02-Kyu-Syllabus-6th-Kyu-5th-Kyu.pdf`} className="text-blue-400 hover:underline">Download the PDF</a> instead.</p>
                    </iframe>
                  </div>
                </div>
              </section>

              <section>
                <h3 className="text-2xl font-bold mb-4 text-purple-400">Advanced Kyu Syllabus</h3>
                <p className="text-gray-300 mb-4">5th Kyu to 4th Kyu detailed requirements</p>
                <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
                  <div className="flex justify-center">
                    <iframe 
                      src={`${process.env.PUBLIC_URL}/03-Kyu-Syllabus-5th-Kyu-4th-Kyu.pdf`} 
                      className="w-full h-96 border border-gray-60 rounded"
                      title="Complete 5th Kyu to 4th Kyu Syllabus"
                      type="application/pdf"
                    >
                      <p>Your browser doesn't support PDF viewing. <a href={`${process.env.PUBLIC_URL}/03-Kyu-Syllabus-5th-Kyu-4th-Kyu.pdf`} className="text-blue-400 hover:underline">Download the PDF</a> instead.</p>
                    </iframe>
                  </div>
                </div>
              </section>
            </div>
          </div>
        )}

        {/* Interactive Documents Tab */}
        {activeTab === 'indd' && (
          <div>
            <div className="mb-8">
              <h2 className="text-3xl font-bold mb-2 text-blue-400">Interactive Documents</h2>
              <p className="text-gray-300">Full-screen viewers for official Adobe InDesign documents</p>
            </div>

            <div className="space-y-8">
              <InddViewer 
                url="https://indd.adobe.com/view/a83f27b4-c22b-42dd-98c1-121764c103d4" 
                title="BJA Grading Syllabus (6th Kyu to 5th Kyu)" 
              />
              
              <InddViewer 
                url="https://indd.adobe.com/view/a592f72d-e681-4d7b-8cda-682a62eb31df" 
                title="BJA Grading Syllabus (5th Kyu to 4th Kyu)" 
              />
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 border-t border-gray-700 mt-12 py-6">
        <div className="max-w-7xl mx-auto px-4 text-center text-gray-400 text-sm">
          <p className="mb-2">🥋 Judo Training Hub - Your Path to Excellence</p>
          <p>Always train under qualified instruction. Respect your training partners. OSU!</p>
        </div>
      </footer>
    </div>
  );
};

export default JudoTrainingApp;
