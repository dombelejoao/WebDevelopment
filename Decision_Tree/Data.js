function getData(number) {
    let data = [];
    data[0] = [
        ["Subject",       "Day",         "Professor",     "Period",       "SHould_I_attend"  ],
        ["Mathematics",   "monday",      "Simon",         "MORNING",                 "yes"   ],
        ["Mathematics",   "wednesday",   "Francisco",     "AFTERNOON",               "yes"   ],
        ["Mathematics",   "friday",      "Simon",         "AFTERNOON",               "yes"   ],
        ["Mathematics",   "tuesday",     "Francisco",     "MORNING",                 "yes"   ],
        ["Programming",   "friday",      "Simon",         "MORNING",                 "yes"   ],
        ["Programming",   "wednesday",   "Francisco",     "MORNING",                 "yes"   ],
        ["Programming",   "wednesday",   "Francsico",     "AFTERNOON",               "no"    ],
        ["Programming",   "tuesday",     "Francsico",     "MORNING",                 "yes"   ],
        ["Programming",   "tuesday",     "Simon",         "AFTERNOON",               "no"    ],
        ["Physics",       "monday",      "Simon",         "MORNING",                 "no"    ],
        ["Physics",       "monday",      "Simon",         "AFTERNOON",               "no"    ],
        ["Physics",       "friday",      "Simon",         "MORNING",                 "no"    ],
        ["Physics",       "wednesday",   "Francisco",     "MORNING",                 "yes"   ],
        ["Physics",       "tuesday",     "Francisco",     "AFTERNOON",               "yes"   ]
    ];
    return data[number]
  }
