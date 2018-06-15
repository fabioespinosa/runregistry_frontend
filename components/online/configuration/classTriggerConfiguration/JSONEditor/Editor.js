import brace from 'brace';
import 'brace/mode/javascript';
import 'brace/mode/c_cpp';
import 'brace/theme/github';
import 'brace/theme/xcode';
import AceEditor from 'react-ace';

const JSONEditor = props => (
    <div>
        <AceEditor
            mode={props.lan}
            theme={props.theme}
            onChange={props.onChange}
            name="UNIQUE_ID_OF_DIV"
            value={`{
   "ECAL": {
      "good": [
         {
            "type": "and",
            "condition": [
               {
                  "type": ">",
                  "identifier": "events",
                  "value": 100
               },
               {
                  "type": "<",
                  "identifier": "runLiveLumi",
                  "value": 80
               }
            ]
         },
         {
            "type": "or",
            "condition": [
               {
                  "type": "=",
                  "identifier": "beam1Stable",
                  "value": "false"
               }
            ]
         }
      ],
      "bad": []
   }
}`}
            editorProps={{
                $blockScrolling: true
            }}
            fontSize={15}
            height="50vh"
            width="100%"
        />
    </div>
);

export default JSONEditor;
