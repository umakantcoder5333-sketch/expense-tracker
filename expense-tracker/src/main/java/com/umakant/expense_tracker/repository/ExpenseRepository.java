
package com.umakant.expense_tracker.repository;

import com.umakant.expense_tracker.model.Expense;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;

public interface ExpenseRepository extends JpaRepository<Expense, Long> {

    List<Expense> findByCategoryIgnoreCase(String category);

    List<Expense> findByExpenseDateBetween(
            LocalDate startDate,
            LocalDate endDate
    );
}
