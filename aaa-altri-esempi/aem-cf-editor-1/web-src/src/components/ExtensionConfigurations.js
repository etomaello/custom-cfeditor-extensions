module.exports = {
    tableDataConfigurations: {
        "glossaryContent": {
            "headers": [
                {name:"key", label:"Key"},
                {name:"title", label:"Title"},
                {name:"description", label:"Description"}
            ],
            "rowKey": "key"
        },
        "dataFullConfiguration": {
            "headers": [
                {name: "index", label: "index"},
                {name:"year", label:"Year"},
                {name:"place", label:"Country"},
                {name:"value", label:"Value"}
            ],
            "rowKey": "index"
        }
    },
    localesConfigurations: {
        "values": [
            {name:"en", label:"English"},
            {name:"de", label:"German"},
            {name:"es", label:"Spanish"},
            {name:"fr", label:"French"},
            {name:"it", label:"Italian"},
            {name:"pt_br", label:"Portuguese (Brazil)"},
            {name:"zh_cn", label:"Chinese (Simplified) (China)"},
            {name:"zh_TW", label:"Chinese (Traditional) (Taiwan region)"},
            {name:"ja", label:"Japanese"},
            {name:"ko_kr", label:"Korean (South Korea)"}
        ]
    },
    youtubeMappingConfiguration: "abstract|youtubeVideoDescription,duration|youtubeVideoDuration,publicationDate|youtubeVideoPublishedDate,title|youtubeVideoTitle,yuotubeImage|youtubeCoverImage"
  }
  