var CommentBox = React.createClass({
  getInitialState: function() {
    return {data: []};
  },
  loadCommentsFromServer: function() {
    $.ajax({
      url: this.props.url,
      dataType: 'json',
      cache: false,
      success: function(data) {
        this.setState({data: data});
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
  },
  componentDidMount: function() {
    this.loadCommentsFromServer();
    //setInterval(this.loadCommentsFromServer, this.props.pollInterval);
  },
  getInitialState: function() {
    return ({data: []});
  },
  handleCommentSubmit: function(comment) {
    var comments = this.state.data;
    var newComments = comments.concat(comment);
    this.setState({data: newComments});

    $.ajax({
      url: this.props.url,
      method: 'POST',
      contentType: 'application/json',
      dataType: 'json',
      data: JSON.stringify(comment),
      success: function(data) {
        this.setState({data: data});
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
  },
  render: function() {
    return (
      <div className="commentBox">
        <h1>Comments</h1>
        <CommentList data={this.state.data}/>
        <CommentForm onCommentSubmit={this.handleCommentSubmit}/>
      </div>
    );
  }
});

var CommentList = React.createClass({
  render: function() {
    var commentNodes = this.props.data.map(function(comment) {
      return (
        <Comment author={comment.author}>
          {comment.text}
        </Comment>
      );
    });
    return (
      <div className="commentList">
        {commentNodes}
      </div>
    );
  }
});

var CommentForm = React.createClass({
  getInitialState: function() {
    return {author: "", text: ""};
  },
  handleAuthorChange: function(e) {
    console.log('Author changed to: ' + JSON.stringify(e.target.value));
    this.setState({author: e.target.value});
  },
  handleTextChange: function(e) {
    console.log('Text changed to: ' + JSON.stringify(e.target.value));
    this.setState({text: e.target.value});
  },
  handleSubmit: function(e) {
    e.preventDefault();
    var author = this.state.author.trim();
    var text = this.state.text.trim();

    var comment = {author: this.state.author.trim(), text: this.state.text.trim()};

    this.props.onCommentSubmit(comment);
    this.setState({author: '', text: ''});
  },
  render: function() {
    return (
      <form className="commentForm" onSubmit={this.handleSubmit}>
        <input type="text" placeholder="Your Name" value={this.state.author} onChange={this.handleAuthorChange}/>
        <input type="text" placeholder="Say Something" value={this.state.text} onChange={this.handleTextChange}/>
        <input type="submit" value="Post" />
      </form>
    );
  }
});

var Comment = React.createClass({
  render: function() {
    return (
      <div className="comment">
        <h2>{this.props.author}</h2>
        {this.props.children}
      </div>
    );
  }
});

ReactDOM.render(<CommentBox url="/api/comments" pollInterval={2000}/>, document.getElementById('content'));