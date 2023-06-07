import React from "react";
import ReactDOM from "react-dom";
import { Editor, EditorState } from "draft-js";
import "draft-js/dist/Draft.css";

export class TextEditor extends React.Component {
	constructor(props) {
		super(props);
		this.state = { editorState: EditorState.createEmpty() };
		this.onChange = (editorState) => this.setState({ editorState });
	}

	render() {
		return <Editor editorState={this.state.editorState} onChange={this.onChange} />;
	}
}

ReactDOM.render(<TextEditor />, document.getElementById("container"));
