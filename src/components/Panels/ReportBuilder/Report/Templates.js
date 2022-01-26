export const templates = {
    "My County's Stats": [
      [
        {
          type: 'text',
          width: 2,
          height: 1,
          content: {
            preset: '7day',
          }
        },
        {
          type: "textReport",
          width: 2,
          height: 3,
        },
        {
          type: "map",
          width:2,
          height:4
        },
        {
          type: "lineChart",
          width: 2,
          height: 3,
        },
        {
          type: 'table',
          topic: 'COVID',
          width: 2,
          height: 3,
        },
        {
          type: 'table',
          topic: 'SDOH',
          width: 2,
          height: 3,
        }
      ],
    ],
    "A National Snapshot": [
      [
        {
          type: "textReport",
          width: 2,
          height: 2,
        },
      ],
    ],
    "My Region's Snapshot": [
      [
        {
          type: "textReport",
          width: 2,
          height: 2,
        },
      ],
    ],
    "My Neighboring County's Stats": [
      [
        {
          type: "textReport",
          width: 2,
          height: 2,
        },
      ],
    ],
    "Something Else (Blank Report)": [[]],
  };