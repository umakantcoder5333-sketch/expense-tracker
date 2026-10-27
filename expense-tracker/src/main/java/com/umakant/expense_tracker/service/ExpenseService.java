package com.umakant.expense_tracker.service;

import com.umakant.expense_tracker.dto.ExpenseRequest;
import com.umakant.expense_tracker.dto.ExpenseResponse;
import com.umakant.expense_tracker.exception.ExpenseNotFoundException;
import com.umakant.expense_tracker.model.Expense;
import com.umakant.expense_tracker.repository.ExpenseRepository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.Set;

@Service
public class ExpenseService {

    private final ExpenseRepository expenseRepository;

    private static final Set<String> ALLOWED_SORT_FIELDS =
            Set.of("id", "title", "amount", "category", "expenseDate");

    // Constructor injection
    public ExpenseService(ExpenseRepository expenseRepository) {
        this.expenseRepository = expenseRepository;
    }

    // Create an expense
    public ExpenseResponse createExpense(ExpenseRequest request) {
        Expense expense = new Expense();

        expense.setTitle(request.getTitle());
        expense.setAmount(request.getAmount());
        expense.setCategory(request.getCategory());
        expense.setExpenseDate(request.getExpenseDate());
        expense.setDescription(request.getDescription());

        Expense savedExpense = expenseRepository.save(expense);

        return convertToResponse(savedExpense);
    }

    // Get all expenses
    public List<ExpenseResponse> getAllExpenses() {
        return expenseRepository.findAll()
                .stream()
                .map(this::convertToResponse)
                .toList();
    }

    // Get an expense by ID
    public ExpenseResponse getExpenseById(Long id) {
        Expense expense = expenseRepository.findById(id)
                .orElseThrow(() ->
                        new ExpenseNotFoundException(
                                "Expense not found with id: " + id
                        ));

        return convertToResponse(expense);
    }

    // Get expenses by category
    public List<ExpenseResponse> getExpensesByCategory(String category) {
        return expenseRepository.findByCategoryIgnoreCase(category)
                .stream()
                .map(this::convertToResponse)
                .toList();
    }

    // Get expenses between two dates
    public List<ExpenseResponse> getExpensesByDateRange(
            LocalDate startDate,
            LocalDate endDate) {

        if (startDate == null || endDate == null) {
            throw new IllegalArgumentException(
                    "Start date and end date are required"
            );
        }

        if (startDate.isAfter(endDate)) {
            throw new IllegalArgumentException(
                    "Start date cannot be after end date"
            );
        }

        return expenseRepository
                .findByExpenseDateBetween(startDate, endDate)
                .stream()
                .map(this::convertToResponse)
                .toList();
    }

    // Update an existing expense
    public ExpenseResponse updateExpense(
            Long id,
            ExpenseRequest request) {

        Expense existingExpense = expenseRepository.findById(id)
                .orElseThrow(() ->
                        new ExpenseNotFoundException(
                                "Expense not found with id: " + id
                        ));

        existingExpense.setTitle(request.getTitle());
        existingExpense.setAmount(request.getAmount());
        existingExpense.setCategory(request.getCategory());
        existingExpense.setExpenseDate(request.getExpenseDate());
        existingExpense.setDescription(request.getDescription());

        Expense updatedExpense = expenseRepository.save(existingExpense);

        return convertToResponse(updatedExpense);
    }

    // Delete an expense
    public void deleteExpense(Long id) {
        if (!expenseRepository.existsById(id)) {
            throw new ExpenseNotFoundException(
                    "Expense not found with id: " + id
            );
        }

        expenseRepository.deleteById(id);
    }

    // Pagination and sorting
    public Page<ExpenseResponse> getExpensesWithPagination(
            int page,
            int size,
            String sortBy,
            String direction) {

        if (page < 0) {
            throw new IllegalArgumentException(
                    "Page number cannot be negative"
            );
        }

        if (size < 1 || size > 100) {
            throw new IllegalArgumentException(
                    "Page size must be between 1 and 100"
            );
        }

        if (!ALLOWED_SORT_FIELDS.contains(sortBy)) {
            throw new IllegalArgumentException(
                    "Invalid sort field: " + sortBy
            );
        }

        if (direction == null ||
                (!direction.equalsIgnoreCase("asc")
                        && !direction.equalsIgnoreCase("desc"))) {
            throw new IllegalArgumentException(
                    "Sort direction must be 'asc' or 'desc'"
            );
        }

        Sort sort = direction.equalsIgnoreCase("desc")
                ? Sort.by(sortBy).descending()
                : Sort.by(sortBy).ascending();

        Pageable pageable = PageRequest.of(page, size, sort);

        return expenseRepository.findAll(pageable)
                .map(this::convertToResponse);
    }

    // Convert Expense entity into ExpenseResponse DTO
    private ExpenseResponse convertToResponse(Expense expense) {
        return new ExpenseResponse(
                expense.getId(),
                expense.getTitle(),
                expense.getAmount(),
                expense.getCategory(),
                expense.getExpenseDate(),
                expense.getDescription()
        );
    }
}