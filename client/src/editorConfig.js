import hljs from 'highlight.js';

// ===== Configure Font Sizes =====
const Size = typeof window !== 'undefined' ? window.Quill?.import('formats/size') : null;
if (Size) {
  Size.whitelist = ['extra-small', 'small', 'medium', 'large'];
}

// ===== Configure Fonts =====
const Font = typeof window !== 'undefined' ? window.Quill?.import('formats/font') : null;
if (Font) {
  Font.whitelist = ['arial', 'comic-sans', 'courier-new', 'georgia', 'helvetica', 'lucida'];
}

// ===== Image Resize Handlers =====
const addResizeHandlers = (imgElement, editor, index) => {
  if (!imgElement) return;

  // Create resize handles
  const handleSize = 8;
  const handles = ['nw', 'ne', 'sw', 'se'];
  
  handles.forEach(handle => {
    const handleElement = document.createElement('div');
    handleElement.className = `ql-resize-handle ql-resize-${handle}`;
    handleElement.style.width = `${handleSize}px`;
    handleElement.style.height = `${handleSize}px`;
    imgElement.appendChild(handleElement);
  });

  // Add resize functionality
  let isResizing = false;
  let startX, startY, startWidth, startHeight;

  const startResize = (e) => {
    isResizing = true;
    startX = e.clientX;
    startY = e.clientY;
    startWidth = parseInt(document.defaultView.getComputedStyle(imgElement).width, 10);
    startHeight = parseInt(document.defaultView.getComputedStyle(imgElement).height, 10);
    e.preventDefault();
  };

  const resize = (e) => {
    if (!isResizing) return;
    const width = startWidth + e.clientX - startX;
    const height = startHeight + e.clientY - startY;
    imgElement.style.width = `${width}px`;
    imgElement.style.height = `${height}px`;
  };

  const stopResize = () => {
    isResizing = false;
    // Update the delta in Quill
    const delta = {
      ops: [{
        retain: index,
        attributes: {
          width: imgElement.style.width,
          height: imgElement.style.height
        }
      }]
    };
    editor.updateContents(delta);
  };

  imgElement.addEventListener('mousedown', startResize);
  document.addEventListener('mousemove', resize);
  document.addEventListener('mouseup', stopResize);

  return () => {
    imgElement.removeEventListener('mousedown', startResize);
    document.removeEventListener('mousemove', resize);
    document.removeEventListener('mouseup', stopResize);
  };
};

// ===== Image & Video Upload Handler =====
const imageHandler = (getQuillRef, uploadToCloudinary, addResizeHandlers) => {
  return async () => {
    const input = document.createElement('input');
    input.setAttribute('type', 'file');
    input.setAttribute('accept', 'image/*, video/*');
    input.click();

    input.onchange = async () => {
      const file = input.files[0];
      if (!file) return;

      const quill = getQuillRef();
      if (!quill) return;
      
      const editor = quill.getEditor();
      const range = editor.getSelection();
      
      if (range) {
        // Show loading indicator
        editor.insertEmbed(range.index, 'image', 'data:image/gif;base64,R0lGODlhEAAQAPIAAP///wAAAMLCwkJCQgAAAGJiYoKCgpKSkiH/C05FVFNDQVBFMi4wAwEAAAAh/hpDcmVhdGVkIHdpdGggYWpheGxvYWQuaW5mbwAh+QQJCgAAACwAAAAAEAAQAAADMwi63P4wyklrE2MIOggZnAdOmGYJRbExwroUmcG2LmDEwnHQLVsYOd2mBzkYDAdKa+dIAAAh+QQJCgAAACwAAAAAEAAQAAADNAi63P5OjCEgG4QMu7DmikRxQlFUYDEZIGBMRVsaqHwctXXf7WEYB4Ag1xjihkMZsiUkKhIAIfkECQoAAAAsAAAAABAAEAAAAzYIujIjK8pByJDMlFYvBoVjHA70GU7xSUJhmKtwHPAKzLO9HMaoKwJZ7Rf8AYPDDzKpZBqfvwQAIfkECQoAAAAsAAAAABAAEAAAAzMIumIlK8oyhpHsnFZfhYumCYUhDAQxRIdhHBGqRoKw0R8DYlJd8z0fMDgsGo/IpHI5TAAAIfkECQoAAAAsAAAAABAAEAAAAzIIunInK0rnZBTwGPNMgQwmdsNgXGJUlIWEuR5oWUIpz8pAEAMe6TwfwyYsGo/IpFKSAAAh+QQJCgAAACwAAAAAEAAQAAADMwi6IMKQORfjdOe82p4wGccc4CEuQradylesojEMBgsUc2G7sDX3lQGBMLAJibufbSlKAAAh+QQJCgAAACwAAAAAEAAQAAADMgi63P7wCRHZnFVdmgHu2nFwlWCI3WGc3TSWhUFGxTAUkGCbtgENBMJAEJsxgMLWzpEAACH5BAkKAAAALAAAAAAQABAAAAMyCLrc/jDKSatlQtScKdceCAjDII7HcQ4EMTCpyrCuUBjCYRgHVtqlAiB1YhiCnlsRkAAAOwAAAAAAAAAAAA==');
        editor.setSelection(range.index + 1);

        try {
          const result = await uploadToCloudinary(file);
          
          // Remove loading indicator and insert actual image
          editor.deleteText(range.index, 1);
          editor.insertEmbed(range.index, 'image', result.url);
          
          // Add resize handlers
          const imgElement = editor.getLeaf(range.index)[0].domNode;
          imgElement.classList.add('ql-image-resizable');
          addResizeHandlers(imgElement, editor, range.index);
          
          editor.setSelection(range.index + 1);
        } catch (error) {
          console.error('Upload failed:', error);
          // Remove loading indicator if upload fails
          editor.deleteText(range.index, 1);
        }
      }
    };
  };
};

// ===== Quill Modules Configuration =====
const modules = (getQuillRef) => ({
  toolbar: {
    container: [
      [
        { header: [1, 2, 3, 4, 5, 6, false] },
        { font: Font?.whitelist || [] },
        { size: Size?.whitelist || [] },
        'bold', 'italic', 'underline', 'strike',
        { color: [] }, { background: [] },
        { script: 'super' }, { script: 'sub' }
      ],
      [
        { align: [] },
        { list: 'ordered' }, { list: 'bullet' },
        { indent: '-1' }, { indent: '+1' },
        'blockquote', 'code-block',
        'link', 'image', 'video', 'clean'
      ]
    ],
    handlers: {
      image: imageHandler(getQuillRef, uploadToCloudinary, addResizeHandlers),
      video: imageHandler(getQuillRef, uploadToCloudinary, addResizeHandlers)
    }
  },
  clipboard: {
    matchVisual: false,
  },
  syntax: {
    highlight: text => hljs.highlightAuto(text).value
  },
  history: {
    delay: 500,
    maxStack: 100,
    userOnly: true
  }
});

// ===== Supported Formats =====
const formats = [
  'header', 'font', 'size',
  'bold', 'italic', 'underline', 'strike',
  'color', 'background',
  'script',
  'align', 'list', 'bullet', 'indent',
  'blockquote', 'code-block',
  'link', 'image', 'video'
];

// ===== Editor Styling =====
const editorStyles = `
  .ql-snow .ql-toolbar {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    gap: 8px;
    padding: 12px;
    background: #f8fafc;
    border: 1px solid #e2e8f0;
    border-radius: 8px 8px 0 0;
  }
  
  .ql-toolbar-group {
    display: flex;
    flex-wrap: wrap;
    gap: 4px;
    align-items: center;
    margin-right: 8px;
  }
  
  .ql-snow .ql-toolbar button {
    width: 32px;
    height: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 4px;
    transition: all 0.2s;
  }
  
  .ql-snow .ql-toolbar button:hover {
    background: #e2e8f0;
  }
  
  .ql-snow .ql-toolbar button.ql-active {
    background: #cbd5e1;
  }
  
  .ql-snow .ql-picker {
    height: 32px;
    margin-right: 4px;
  }
  
  .ql-snow .ql-picker-label {
    padding: 0 8px;
  }
  
  .ql-snow .ql-stroke {
    stroke-width: 2;
  }
  
  .ql-snow .ql-picker:not(.ql-color-picker):not(.ql-icon-picker) svg {
    width: 18px;
    height: 18px;
  }
  
  .ql-container.ql-snow {
    border: 1px solid #e2e8f0;
    border-top: none;
    border-radius: 0 0 8px 8px;
    font-family: inherit;
  }
  
  .ql-editor {
    min-height: 300px;
    font-size: 16px;
    line-height: 1.6;
    padding: 12px 15px;
  }
  
  .ql-editor.ql-blank::before {
    color: rgba(0, 0, 0, 0.6);
    font-style: normal;
    left: 15px;
  }
  
  .ql-video {
    width: 100%;
    height: 400px;
  }
  
  .ql-snow .ql-tooltip {
    z-index: 100;
  }

  /* Image resize styles */
  .ql-image-resizable {
    position: relative;
    max-width: 100%;
    cursor: default;
  }
  
  .ql-resize-handle {
    position: absolute;
    width: 8px;
    height: 8px;
    background-color: #4299e1;
    border: 1px solid #ffffff;
    z-index: 10;
  }
  
  .ql-resize-nw {
    top: -4px;
    left: -4px;
    cursor: nw-resize;
  }
  
  .ql-resize-ne {
    top: -4px;
    right: -4px;
    cursor: ne-resize;
  }
  
  .ql-resize-sw {
    bottom: -4px;
    left: -4px;
    cursor: sw-resize;
  }
  
  .ql-resize-se {
    bottom: -4px;
    right: -4px;
    cursor: se-resize;
  }
  
  @media (max-width: 768px) {
    .ql-toolbar-group {
      margin-bottom: 8px;
    }
  }
`;

export {
  modules,
  formats,
  imageHandler,
  addResizeHandlers,
  editorStyles,
  Font,
  Size
};