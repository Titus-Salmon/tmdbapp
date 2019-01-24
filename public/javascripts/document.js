class Document {
  constructor(margin, header, subheader, body, docName) {
    this.doc = new jsPDF('p', 'pt', 'letter');
    this.margin = margin;//given in points
    this.currentLine = margin;
    this.pageHeight = this.doc.internal.pageSize.getHeight() - margin;
    this.pageWidth = this.doc.internal.pageSize.getWidth();
    this.lineHeight = this.doc.getLineHeight() / 1.5;
    this.header = header;
    this.subheader = subheader;
    this.body = body;
    this.docName = docName;
    this.color = {
      "black": 0,
      "white": 255,
      "red": [255, 0, 0]
    }
  }

  printFormLine(labels, data, labelBelowLine) {
    this.doc.setFontSize(this["body"].size);
    this.doc.setFontStyle(this["body"].style);
    this.doc.setTextColor(0);
    let cursor = this.margin;
    let width = this.pageWidth - this.margin*2;
    let endpoint = this.pageWidth - this.margin;
    for(let i = 0; i < labels.length; i++) {
      if(labelBelowLine !== undefined) {
        let x1 = cursor;
        let x2 = x1 + Math.round(width / labels.length);
        if(x2 > endpoint) {
          x2 = endpoint;
        }
        let y1 = this.currentLine + this.lineHeight/4;
        let y2 = this.currentLine + this.lineHeight/4;
        this.doc.line(x1, y1, x2, y2);
        let dataX = (x2 + x1)/2 - this.doc.getTextWidth(data[i])/2;
        let labelX = (x2 + x1)/2 - this.doc.getTextWidth(labels[i])/2;
        this.doc.text(data[i], dataX, this.currentLine);
        this.doc.text(labels[i], labelX, this.currentLine + this.lineHeight);
        cursor = x2 + this.doc.getTextWidth("   ");
      }
      else {
        let x1 = cursor + this.doc.getTextWidth(labels[i]);
        let x2 = x1 + Math.round(width / labels.length) - this.doc.getTextWidth(labels[i]);
        if(x2 > endpoint) {
          x2 = endpoint;
        }
        let y1 = this.currentLine + this.lineHeight/4;
        let y2 = this.currentLine + this.lineHeight/4;
        this.doc.line(x1, y1, x2, y2);
        this.doc.text(`${labels[i]} ${data[i]}`, cursor, this.currentLine);
        cursor = x2 + this.doc.getTextWidth(" ");
      }
    }
    this.pageQuery(this.currentLine + this.lineHeight);
    this.currentLine += this.lineHeight * 2;
  }

  printLine(text, type, align, color) {
    if(type === undefined) {
      var type = "body";
    }
    if(align === undefined) {
      var align = "left";
    }
    if(color === undefined) {
      var color = this.color.black;
    }

    this.doc.setFontSize(this[type].size);
    this.doc.setFontStyle(this[type].style);
    this.doc.setTextColor(color);
    if(align === "left") {
      this.doc.text(text, this.margin, this.currentLine);
    }
    else if(align ==="right") {
      let w = this.doc.getTextWidth(text);
      this.doc.text(text, this.pageWidth - this.margin - w, this.currentLine);
    }
    else if(align === "center") {
      let centered = (this.pageWidth/2) - (this.doc.getTextWidth(text)/2);
      this.doc.text(text, centered, this.currentLine);
    }
    this.pageQuery(this.currentLine + this.lineHeight);
    this.currentLine += this.lineHeight
  }

  print(text, type, align, color) {
    if(type === undefined) {
      var type = "body";
    }
    if(align === undefined) {
      var align = "left";
    }
    if(color === undefined) {
      var color = this.color.black;
    }

    this.doc.setFontSize(this[type].size);
    this.doc.setFontStyle(this[type].style);
    this.doc.setTextColor(color);

    let words = text.split(" ");
    let frame = this.pageWidth - this.margin*2;
    let cursor = 0;
    if(align === "left") {
      cursor = this.margin;
    }
    else if (align === "right") {
      cursor = this.pageWidth - this.margin;
    }
    else if (align === "center") {
      cursor = this.margin;
    }
    for(var i = 0; i < words.length; i++) {
      if(frame - this.doc.getTextWidth(words[i] + " ") <= 0) {
        this.pageQuery(this.currentLine + this.lineHeight);
        this.currentLine += this.lineHeight;
        frame = this.pageWidth - this.margin*2;
        cursor = this.margin;
        //this.doc.text(words[i] + " ", cursor, this.currentLine);;
      }
      this.multiLinePrint(words[i] + " ", cursor, this.currentLine);

      frame -= this.doc.getTextWidth(words[i] + " ");
      cursor += this.doc.getTextWidth(words[i] + " ");
    }
    console.log(text);
    this.pageQuery(this.currentLine + this.lineHeight);
    this.currentLine += this.lineHeight;
  }

  multiLinePrint(word, x, y) {
    this.doc.text(word, x, y);
  }

  newLine(lines) {
    if(lines === undefined) {
      var lines = 1;
    }
    for(var i = 0; i < lines; i++) {
      this.pageQuery(this.currentLine + this.lineHeight);
      this.currentLine += this.lineHeight;
      console.log("NEW LINE");
    }
  }

  horizontalRule() {
    this.doc.line(this.margin, this.currentLine, this.pageWidth - this.margin, this.currentLine);
    this.pageQuery(this.currentLine + this.lineHeight);
    this.currentLine += this.lineHeight;
  }

  image(imgDataURI, width, height) {
    this.doc.addImage(imgDataURI, (this.pageWidth/2) - width/2, this.currentLine, width, height);
    this.pageQuery(this.currentLine + this.lineHeight*2 + height);
    this.currentLine += this.lineHeight*2 + height;
  }

  pageQuery(height) {
    if(height >= this.pageHeight) {
      this.doc.addPage();
      this.currentLine = this.margin;
    }
  }

  toBase64() {
  return this.doc.output('datauristring');
  }

  toPDF() {
    this.doc.save(`${this.docName}.pdf`);
  }
}
