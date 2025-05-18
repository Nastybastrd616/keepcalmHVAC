import { Component } from '@angular/core';
import { saveAs } from 'file-saver';

@Component({
  selector: 'app-dood',
  templateUrl: './dood.component.html',
  styleUrls: ['./dood.component.css']
})
export class DoodComponent {
  writeToFile() {
    const filePath = 'src/assets/dood.txt';
    
    // Write "dood" to the file
    const data = 'dood\n';
    const blob = new Blob([data], { type: 'text/plain' });
    saveAs(blob, 'dood.txt');
  }
}