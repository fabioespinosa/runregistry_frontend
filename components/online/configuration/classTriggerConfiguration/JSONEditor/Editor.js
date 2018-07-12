import brace from 'brace';
import 'brace/mode/javascript';
import 'brace/mode/c_cpp';
import 'brace/theme/github';
import 'brace/theme/xcode';
import AceEditor from 'react-ace';

const JSONEditor = ({ children, lan, theme, onChange, value }) => (
    <div>
        {children}
        <AceEditor
            mode={lan}
            theme={theme}
            onChange={onChange}
            name="UNIQUE_ID_OF_DIV"
            value={value}
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
