import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-main-view',
  templateUrl: './main-view.component.html',
  styleUrls: ['./main-view.component.css']
})
export class MainViewComponent implements OnInit {
  municipio:String="";
  filtros=[
    {name: 'Todos', code: 'todos'},
    {name: 'Algunosxd', code: 'algunos'}
  ];
  estados=[
    {name: 'Velocidad de bajada', code: 'Bajada'},
    {name: 'Velocidad de subida', code: 'Subida'}
  ];
  selectedFiltro="todos";
  selectedEstado="Bajada";
  constructor() { }
  ngOnInit(): void {
  }

}
