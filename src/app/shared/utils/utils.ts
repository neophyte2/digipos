import { FormControl } from "@angular/forms";

// This will not allow only spaces to be entered.
export const REMOVESPACESONLY = (control: FormControl) => {
    const isWhitespace = (control.value || '').trim().length === 0;
    const isValid = !isWhitespace;
    return isValid ? null : { 'whitespace': true };
}

// tslint:disable-next-line:max-line-length
export const VALIDEMAILREGEX = /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/;

export default class DateUtils {

    padFigure(num: any) {
        return num.toString().length == 1 ? `0${num}` : num;
    }

    convertTimestampToDate(seconds: any) {
        const date = new Date(Number(seconds));
        let month = this.padFigure(date.getMonth() + 1),
            day = this.padFigure(date.getDate()),
            year = date.getFullYear(),
            hour = date.getHours(),
            min = date.getMinutes(),
            sec = date.getSeconds();
        return seconds == 0 ? "" : `${year}-${month}-${day} , ${hour}:${min}:${sec}`;
    }
}

export const exportTableToCSV = (data: any[], columns: { value: string; title: string }[], filename: any) => {
    let newData: any = [];
    data.forEach((dat) => {
        newData.push(columns.map((col) => `"${dat[col.value]}"`).join(","));
    });
    newData = [columns.map((col) => col.title).join(","), ...newData];
    downloadCSV(newData.join("\n"), `${filename}.csv`);
};

export const downloadCSV = (csv: any, filename: any) => {
    var csvFile;
    var downloadLink;
    // CSV file
    csvFile = new Blob([csv], { type: "text/csv" });
    // Download link
    downloadLink = document.createElement("a");

    // File name
    downloadLink.download = filename;

    // Create a link to the file
    downloadLink.href = window.URL.createObjectURL(csvFile);

    // Hide download link
    downloadLink.style.display = "none";

    // Add the link to DOM
    document.body.appendChild(downloadLink);

    // Click download link
    downloadLink.click();
};

export const getInitials = (name: any) => {
    if (name == null) return null;
    let initials = '',
        parts = name.split(' ');
    for (let i = 0; i < parts.length; i++)
        if (parts[i].length > 0 && parts[i] !== '')
            initials += parts[i][0]
    return initials;
}

/**
  * convert amoutn with currency n formats
  * @param amt 
  * @returns 
  */
export const tableCurrency = (amt: any) => {
    return new Intl.NumberFormat('en-NG',
        { style: 'currency', currency: 'NGN' }
    ).format(amt).replace(/\.00$/, '');;
}

export const getPageCountUtil = (data: { pageNumber: number; pageSize: number; dataLength: number }) => {
    const { pageNumber, pageSize, dataLength } = data;
    const count = (pageNumber - 1) * pageSize + dataLength;
    return count || 0;
};
