import { Component } from '@angular/core';
import {TabsComponent} from './tabs/tabs.component';

@Component({
  selector: 'my-app',
  standalone: true,
  imports: [
    TabsComponent
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  /*
  ngOnInit() {
    const chart = VennDiagram();
    d3.select("#venn")
      .datum(this.sets)
      .call(chart);

    /*
    d3.select("#venn").on("mouseover", () => {
      // Randomize sizes
      this.sets.forEach((dd, ii) => {
        dd.size = Math.round(Math.random() * 20 + 1);
        console.log(`${ii} ${dd.sets}`, dd.size);
      });

      // Redraw the diagram with updated data
      d3.select("#venn").datum(this.sets).call(chart);
    });


  }
  */
}
