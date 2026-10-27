
package com.umakant.expense_tracker.controller;

import com.umakant.expense_tracker.dto.ExpenseRequest;
import com.umakant.expense_tracker.dto.ExpenseResponse;
import com.umakant.expense_tracker.service.ExpenseService;

import jakarta.validation.Valid;

import org.springframework.data.domain.Page;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@CrossOrigin(origins = {
        "http://localhost:5173",
        "http://localhost:5174"
})

@RestController
@RequestMapping("/api/expenses")
public class ExpenseController {

    private final ExpenseService expenseService;

    // Constructor injection
    public ExpenseController(ExpenseService expenseService) {
        this.expenseService = expenseService;
    }

    // Create a new expense
    @PostMapping
    public ResponseEntity<ExpenseResponse> createExpense(
            @Valid @RequestBody ExpenseRequest request) {

        ExpenseResponse savedExpense =
                expenseService.createExpense(request);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(savedExpense);
    }

    // Get all expenses
    @GetMapping
    public List<ExpenseResponse> getAllExpenses() {
        return expenseService.getAllExpenses();
    }

    // Get an expense by ID
    @GetMapping("/{id}")
    public ExpenseResponse getExpenseById(
            @PathVariable Long id) {

        return expenseService.getExpenseById(id);
    }

    // Get expenses by category
    @GetMapping("/category/{category}")
    public List<ExpenseResponse> getExpensesByCategory(
            @PathVariable String category) {

        return expenseService.getExpensesByCategory(category);
    }

    // Get expenses between two dates
    @GetMapping("/date-range")
    public List<ExpenseResponse> getExpensesByDateRange(
            @RequestParam
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
            LocalDate startDate,

            @RequestParam
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
            LocalDate endDate) {

        return expenseService.getExpensesByDateRange(
                startDate,
                endDate
        );
    }

    // Update an existing expense
    @PutMapping("/{id}")
    public ExpenseResponse updateExpense(
            @PathVariable Long id,
            @Valid @RequestBody ExpenseRequest request) {

        return expenseService.updateExpense(id, request);
    }

    // Delete an expense by ID
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteExpense(
            @PathVariable Long id) {

        expenseService.deleteExpense(id);

        return ResponseEntity.noContent().build();
    }

    // Get expenses with pagination and sorting
    @GetMapping("/page")
    public Page<ExpenseResponse> getExpensesWithPagination(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "5") int size,
            @RequestParam(defaultValue = "id") String sortBy,
            @RequestParam(defaultValue = "asc") String direction) {

        return expenseService.getExpensesWithPagination(
                page,
                size,
                sortBy,
                direction
        );
    }
}
