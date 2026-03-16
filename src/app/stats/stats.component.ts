import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ShoppingListService } from '../services/shopping-list.service';
import { AuthService } from '../services/auth.service';
import { TranslateService } from '../services/translate.service';
import { TranslatePipe } from '../pipes/translate.pipe';

@Component({
  selector: 'app-stats',
  standalone: true,
  imports: [CommonModule, RouterModule, TranslatePipe],
  templateUrl: './stats.component.html',
  styleUrl: './stats.component.css'
})
export class StatsComponent implements OnInit {
  totalLists = signal(0);
  archivedCount = signal(0);
  totalProducts = signal(0);
  costByCategory = signal<{ category: string; count: number; cost: number }[]>([]);
  totalCost = signal(0);

  constructor(
    private shoppingListService: ShoppingListService,
    public authService: AuthService,
    public translate: TranslateService
  ) {}

  ngOnInit(): void {
    this.compute();
  }

  private compute(): void {
    const all = this.shoppingListService.getAllLists();
    const userId = this.authService.getCurrentUser()?.id;
    const myLists = userId ? all.filter(l => l.ownerId === userId) : all;
    const active = myLists.filter(l => !l.archived);
    const archived = myLists.filter(l => l.archived);

    this.totalLists.set(active.length);
    this.archivedCount.set(archived.length);
    let totalProducts = 0;
    let totalCost = 0;
    const byCat: Record<string, { count: number; cost: number }> = {};

    for (const list of myLists) {
      for (const p of list.products) {
        totalProducts++;
        const cost = (p.price ?? 0) * p.quantity;
        totalCost += cost;
        const cat = p.category || 'Inne';
        if (!byCat[cat]) byCat[cat] = { count: 0, cost: 0 };
        byCat[cat].count++;
        byCat[cat].cost += cost;
      }
    }

    this.totalProducts.set(totalProducts);
    this.totalCost.set(totalCost);
    this.costByCategory.set(
      Object.entries(byCat).map(([category, v]) => ({ category, ...v })).sort((a, b) => b.cost - a.cost)
    );
  }
}
